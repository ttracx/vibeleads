import { prisma } from './prisma'
import { PLANS, PlanType } from './stripe'

export async function getUserPlan(userId: string): Promise<PlanType> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      stripePriceId: true,
      stripeCurrentPeriodEnd: true,
    },
  })

  if (!user) return 'FREE'

  // Check if subscription is active
  if (
    user.stripeCurrentPeriodEnd &&
    new Date(user.stripeCurrentPeriodEnd) > new Date()
  ) {
    if (user.stripePriceId === PLANS.PRO.priceId) return 'PRO'
    if (user.stripePriceId === PLANS.STARTER.priceId) return 'STARTER'
  }

  return 'FREE'
}

export async function getLeadCount(userId: string): Promise<number> {
  const count = await prisma.lead.count({
    where: { userId },
  })
  return count
}

export async function canCreateLead(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId)
  const count = await getLeadCount(userId)
  const limit = PLANS[plan].leads

  return count < limit
}

export async function getLeadsRemaining(userId: string): Promise<number> {
  const plan = await getUserPlan(userId)
  const count = await getLeadCount(userId)
  const limit = PLANS[plan].leads

  if (limit === Infinity) return Infinity
  return Math.max(0, limit - count)
}
