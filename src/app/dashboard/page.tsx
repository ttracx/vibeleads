import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserPlan, getLeadsRemaining } from '@/lib/subscription'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Users, FileText, Zap, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { PLANS } from '@/lib/stripe'

async function getStats(userId: string) {
  const [totalLeads, todayLeads, forms] = await Promise.all([
    prisma.lead.count({ where: { userId } }),
    prisma.lead.count({
      where: {
        userId,
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.form.count({ where: { userId } }),
  ])

  return { totalLeads, todayLeads, forms }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const [stats, plan, remaining] = await Promise.all([
    getStats(session.user.id),
    getUserPlan(session.user.id),
    getLeadsRemaining(session.user.id),
  ])

  const planInfo = PLANS[plan]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {session.user.name || session.user.email}!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Forms</p>
                <p className="text-2xl font-bold text-gray-900">{stats.forms}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Remaining</p>
                <p className="text-2xl font-bold text-gray-900">
                  {remaining === Infinity ? '∞' : remaining}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Info */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Your Plan</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{planInfo.name}</p>
              <p className="text-gray-600">
                {planInfo.leads === Infinity
                  ? 'Unlimited leads'
                  : `${planInfo.leads} leads/month`}
              </p>
            </div>
            {plan === 'FREE' && (
              <Link
                href="/dashboard/settings"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Upgrade
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/dashboard/forms">
          <Card className="hover:border-blue-300 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Manage Forms</h3>
              <p className="text-gray-600 text-sm">
                Create and customize your lead capture forms
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/leads">
          <Card className="hover:border-blue-300 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-2">View Leads</h3>
              <p className="text-gray-600 text-sm">
                See all your captured leads and export to CSV
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
