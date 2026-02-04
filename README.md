# VibeLeads 🚀

Simple lead capture and email collection tool for landing pages.

**Live:** https://vibeleads.vercel.app

## Features

- ✅ **Embeddable Forms** - Copy one line of code to add lead capture forms to any website
- ✅ **Lead Dashboard** - View and manage all your captured leads
- ✅ **CSV Export** - Download leads anytime, compatible with any email marketing tool
- ✅ **Webhook Notifications** - Get instant notifications when new leads come in
- ✅ **Stripe Integration** - Simple subscription billing

## Pricing

| Plan | Price | Leads/Month | Features |
|------|-------|-------------|----------|
| Free | $0 | 100 | 1 form, CSV export |
| Starter | $9/mo | 1,000 | Unlimited forms, webhooks, priority support |
| Pro | $29/mo | Unlimited | Custom branding, API access |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** Neon PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js
- **Payments:** Stripe
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database (Neon recommended)
- Stripe account

### Installation

```bash
# Clone the repo
git clone https://github.com/ttracx/vibeleads.git
cd vibeleads

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Push database schema
bunx prisma db push

# Run development server
bun run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_STARTER_PRICE_ID="price_..."
STRIPE_PRO_PRICE_ID="price_..."

# App
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## Embed Code

To add a lead capture form to your website:

```html
<!-- Add this where you want the form to appear -->
<div id="vibeleads-form"></div>
<script src="https://vibeleads.vercel.app/api/embed/YOUR_FORM_ID"></script>
```

## Webhook Payload

When a new lead is captured:

```json
{
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
}
```

Includes `X-Signature` header with HMAC-SHA256 signature for verification.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/leads` | GET | List leads (authenticated) |
| `/api/leads` | POST | Submit lead (public) |
| `/api/leads/export` | GET | Export leads as CSV |
| `/api/forms` | GET/POST | Manage forms |
| `/api/webhooks` | GET/POST | Manage webhooks |

## License

MIT

---

Built with ❤️ by [VibeCaaS](https://vibecaas.com)
