'use client'

import { useState } from 'react'
import { Copy, Check, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface EmbedCodeProps {
  formId: string
}

export function EmbedCode({ formId }: EmbedCodeProps) {
  const [copied, setCopied] = useState<'script' | 'html' | null>(null)

  const appUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_APP_URL || 'https://vibeleads.vercel.app'

  const scriptCode = `<script src="${appUrl}/api/embed/${formId}"></script>`
  const htmlCode = `<!-- VibeLeads Form -->
<div id="vibeleads-form"></div>
<script src="${appUrl}/api/embed/${formId}"></script>`

  async function copyToClipboard(text: string, type: 'script' | 'html') {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Embed Code</h3>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Add this code to your website to display the lead capture form.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Full Embed (Recommended)</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(htmlCode, 'html')}
            >
              {copied === 'html' ? (
                <>
                  <Check className="w-4 h-4 mr-1 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            <code>{htmlCode}</code>
          </pre>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Script Only</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(scriptCode, 'script')}
            >
              {copied === 'script' ? (
                <>
                  <Check className="w-4 h-4 mr-1 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            <code>{scriptCode}</code>
          </pre>
          <p className="text-xs text-gray-500 mt-2">
            Note: You&apos;ll need to add a <code className="bg-gray-100 px-1 rounded">&lt;div id=&quot;vibeleads-form&quot;&gt;&lt;/div&gt;</code> element where you want the form to appear.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
