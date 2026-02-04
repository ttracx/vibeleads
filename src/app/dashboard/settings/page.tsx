'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { CreditCard, User, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const plans = [
  {
    name: 'Free',
    price: 0,
    leads: 100,
    priceId: null,
    features: ['100 leads/month', '1 form', 'CSV export'],
  },
  {
    name: 'Starter',
    price: 9,
    leads: 1000,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
    features: ['1,000 leads/month', 'Unlimited forms', 'Webhook notifications', 'Priority support'],
  },
  {
    name: 'Pro',
    price: 29,
    leads: Infinity,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    features: ['Unlimited leads', 'Unlimited forms', 'Custom branding', 'API access'],
  },
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const [currentPlan, setCurrentPlan] = useState('Free')
  const [loading, setLoading] = useState<string | null>(null)

  async function handleUpgrade(priceId: string | null) {
    if (!priceId) return
    setLoading(priceId)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(null)
    }
  }

  async function handleManageBilling() {
    setLoading('portal')

    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Portal error:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and subscription</p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Account</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Email:</span> {session?.user?.email}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Name:</span> {session?.user?.name || 'Not set'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Billing */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Subscription</h2>
            </div>
            {currentPlan !== 'Free' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleManageBilling}
                loading={loading === 'portal'}
              >
                Manage Billing
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-xl border-2 ${
                  currentPlan === plan.name
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">/mo</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {currentPlan === plan.name ? (
                  <div className="text-center text-sm font-medium text-blue-600">
                    Current Plan
                  </div>
                ) : plan.priceId ? (
                  <Button
                    className="w-full"
                    onClick={() => handleUpgrade(plan.priceId!)}
                    loading={loading === plan.priceId}
                  >
                    Upgrade
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Free Tier
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
