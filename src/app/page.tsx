import Link from 'next/link'
import { Zap, Mail, Download, Webhook, Check } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">VibeLeads</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Capture Leads<br />
          <span className="text-blue-600">Without the Hassle</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Beautiful, embeddable forms for your landing pages. 
          Export to CSV, get webhook notifications, and scale with simple pricing.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
          >
            Start Free — 100 Leads/month
          </Link>
          <Link
            href="#pricing"
            className="text-gray-600 px-8 py-4 font-semibold text-lg hover:text-gray-900 transition-colors"
          >
            View Pricing →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need. Nothing you don&apos;t.
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Embeddable Forms</h3>
            <p className="text-gray-600">
              Copy one line of code to add beautiful lead capture forms to any website.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">CSV Export</h3>
            <p className="text-gray-600">
              Download your leads anytime. Compatible with any email marketing tool.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Webhook className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Webhook Notifications</h3>
            <p className="text-gray-600">
              Get instant notifications when new leads come in. Connect to Zapier, Make, or your own backend.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
          Start free, upgrade when you grow. No hidden fees.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Free</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" />
                100 leads/month
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" />
                1 form
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" />
                CSV export
              </li>
            </ul>
            <Link
              href="/register"
              className="block w-full text-center bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Starter */}
          <div className="bg-blue-600 p-8 rounded-2xl shadow-lg text-white relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
              POPULAR
            </div>
            <h3 className="text-lg font-semibold mb-2">Starter</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">$9</span>
              <span className="text-blue-200">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-blue-200" />
                1,000 leads/month
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-blue-200" />
                Unlimited forms
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-blue-200" />
                Webhook notifications
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-blue-200" />
                Priority support
              </li>
            </ul>
            <Link
              href="/register"
              className="block w-full text-center bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors"
            >
              Start Trial
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">$29</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" />
                Unlimited leads
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" />
                Unlimited forms
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" />
                Custom branding
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" />
                API access
              </li>
            </ul>
            <Link
              href="/register"
              className="block w-full text-center bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">VibeLeads</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} VibeLeads. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
