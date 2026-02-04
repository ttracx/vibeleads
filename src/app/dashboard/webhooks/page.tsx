'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ExternalLink, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { format } from 'date-fns'

interface Webhook {
  id: string
  name: string
  url: string
  secret: string | null
  events: string[]
  active: boolean
  createdAt: string
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [creating, setCreating] = useState(false)
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchWebhooks()
  }, [])

  async function fetchWebhooks() {
    try {
      const res = await fetch('/api/webhooks')
      const data = await res.json()
      setWebhooks(data)
    } catch (error) {
      console.error('Failed to fetch webhooks:', error)
    } finally {
      setLoading(false)
    }
  }

  async function createWebhook() {
    if (!name.trim() || !url.trim()) return
    setCreating(true)

    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url }),
      })

      if (res.ok) {
        setName('')
        setUrl('')
        setShowCreate(false)
        fetchWebhooks()
      }
    } catch (error) {
      console.error('Failed to create webhook:', error)
    } finally {
      setCreating(false)
    }
  }

  function toggleSecret(id: string) {
    const newSet = new Set(visibleSecrets)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setVisibleSecrets(newSet)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webhooks</h1>
          <p className="text-gray-600">Get notified when new leads come in</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Webhook
        </Button>
      </div>

      {/* Create Webhook */}
      {showCreate && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Add Webhook</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Name"
              placeholder="My webhook"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="URL"
              placeholder="https://example.com/webhook"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={createWebhook} loading={creating}>
                Create Webhook
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Webhooks List */}
      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{webhook.name}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      webhook.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {webhook.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <ExternalLink className="w-4 h-4" />
                    <span className="truncate max-w-md">{webhook.url}</span>
                  </div>

                  {webhook.secret && (
                    <div className="flex items-center gap-2 text-sm">
                      <Key className="w-4 h-4 text-gray-400" />
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {visibleSecrets.has(webhook.id)
                          ? webhook.secret
                          : '••••••••••••••••••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => toggleSecret(webhook.id)}
                        className="text-blue-600 text-xs hover:text-blue-700"
                      >
                        {visibleSecrets.has(webhook.id) ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    Created {format(new Date(webhook.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {webhooks.length === 0 && !showCreate && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">
              No webhooks configured. Add one to get notified of new leads.
            </p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Webhook
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Documentation */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Webhook Payload</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            When a new lead is captured, we&apos;ll send a POST request to your webhook URL with the following payload:
          </p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "event": "lead.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": "clr1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "formId": "form_abc123",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}`}
          </pre>
          <p className="text-sm text-gray-600 mt-4">
            We include an <code className="bg-gray-100 px-1 rounded">X-Signature</code> header with HMAC-SHA256 
            signature using your webhook secret for verification.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
