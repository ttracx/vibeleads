'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
}

export default function FormSettingsPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = use(params)
  const router = useRouter()
  const [form, setForm] = useState<Form | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchForm()
  }, [formId])

  async function fetchForm() {
    try {
      const res = await fetch(`/api/forms/${formId}`)
      if (res.ok) {
        const data = await res.json()
        setForm(data)
      } else {
        router.push('/dashboard/forms')
      }
    } catch (error) {
      console.error('Failed to fetch form:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveForm() {
    if (!form) return
    setSaving(true)

    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          buttonText: form.buttonText,
          successMessage: form.successMessage,
          primaryColor: form.primaryColor,
          collectName: form.collectName,
          collectPhone: form.collectPhone,
        }),
      })

      if (res.ok) {
        router.push('/dashboard/forms')
      }
    } catch (error) {
      console.error('Failed to save form:', error)
    } finally {
      setSaving(false)
    }
  }

  async function deleteForm() {
    if (!confirm('Are you sure you want to delete this form? All leads will be lost.')) {
      return
    }

    setDeleting(true)

    try {
      const res = await fetch(`/api/forms/${formId}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/dashboard/forms')
      }
    } catch (error) {
      console.error('Failed to delete form:', error)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!form) return null

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push('/dashboard/forms')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Form Settings</h1>
          <p className="text-gray-600">Customize your lead capture form</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Basic Settings</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Form Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Description (optional)"
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Form Appearance</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Button Text"
            value={form.buttonText}
            onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
          />
          <Input
            label="Success Message"
            value={form.successMessage}
            onChange={(e) => setForm({ ...form, successMessage: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <Input
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Form Fields</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.collectName}
              onChange={(e) => setForm({ ...form, collectName: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Collect name</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.collectPhone}
              onChange={(e) => setForm({ ...form, collectPhone: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Collect phone number</span>
          </label>
        </CardContent>
      </Card>

      <EmbedCode formId={form.id} />

      <div className="flex items-center justify-between pt-4">
        <Button variant="danger" onClick={deleteForm} loading={deleting}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Form
        </Button>
        <Button onClick={saveForm} loading={saving}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
