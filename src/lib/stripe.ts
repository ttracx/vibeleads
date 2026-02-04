import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
})

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    leads: 100,
    priceId: null,
  },
  STARTER: {
    name: 'Starter',
    price: 9,
    leads: 1000,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
  },
  PRO: {
    name: 'Pro',
    price: 29,
    leads: Infinity,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
  },
} as const

export type PlanType = keyof typeof PLANS

export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  returnUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${returnUrl}?success=true`,
    cancel_url: `${returnUrl}?canceled=true`,
    metadata: {
      userId,
    },
  })

  return session
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}
