import { prisma } from './prisma'
import crypto from 'crypto'

export interface WebhookPayload {
  event: string
  timestamp: string
  data: Record<string, unknown>
}

function createSignature(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

export async function sendWebhooks(
  userId: string,
  event: string,
  data: Record<string, unknown>
) {
  const webhooks = await prisma.webhook.findMany({
    where: {
      userId,
      active: true,
      events: { has: event },
    },
  })

  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    data,
  }

  const payloadString = JSON.stringify(payload)

  const results = await Promise.allSettled(
    webhooks.map(async (webhook) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (webhook.secret) {
        headers['X-Signature'] = createSignature(payloadString, webhook.secret)
      }

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body: payloadString,
      })

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`)
      }

      return { webhookId: webhook.id, status: 'success' }
    })
  )

  return results
}
