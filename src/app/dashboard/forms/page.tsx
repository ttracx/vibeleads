'use client'

import { useState, useEffect } from 'react'
import { Plus, Settings, Code, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { EmbedCode } from '@/components/dashboard/embed-code'

interface Form {
  id: string
  name: string
  description: string | null
  buttonText: string
  successMessage: string
  primaryColor: string
  collectName: boolean
  collectPhone: boolean
  createdAt: string
  _count: { leads: number }
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [selectedForm, setSelectedForm] = useState<Form | null>(null)
  const [newFormName, setNewFormName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchForms()
  }, [])

  async function fetchForms() {
    try {
      const res = await fetch('/api/forms')
      const data = await res.json()
      setForms(data)
    } catch (error) {
      console.error('Failed to fetch forms:', error)
    } finally {
      setLoading(false)
    }
  }

  async function createForm() {
    if (!newFormName.trim()) return
    setCreating(true)

    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFormName }),
      })

      if (res.ok) {
        setNewFormName('')
        setShowCreate(false)
        fetchForms()
      }
    } catch (error) {
      console.error('Failed to create form:', error)
    } finally {
      setCreating(false)
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
          <p className="text-gray-600">Create and manage your lead capture forms</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Form
        </Button>
      </div>

      {/* Create Form Modal */}
      {showCreate && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Create New Form</h3>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Form name"
                value={newFormName}
                onChange={(e) => setNewFormName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={createForm} loading={creating}>
                Create
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Forms List */}
      <div className="grid md:grid-cols-2 gap-6">
        {forms.map((form) => (
          <Card key={form.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{form.name}</h3>
                  {form.description && (
                    <p className="text-sm text-gray-500">{form.description}</p>
                  )}
                </div>
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: form.primaryColor }}
                />
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {form._count.leads} leads
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedForm(form)}
                >
                  <Code className="w-4 h-4 mr-1" />
                  Embed
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = `/dashboard/forms/${form.id}`}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {forms.length === 0 && !showCreate && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No forms yet. Create your first form to get started!</p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Form
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Embed Code Modal */}
      {selectedForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full">
            <EmbedCode formId={selectedForm.id} />
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => setSelectedForm(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
