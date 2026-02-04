import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canCreateLead } from '@/lib/subscription'
import { sendWebhooks } from '@/lib/webhooks'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const formId = searchParams.get('formId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: Record<string, unknown> = { userId: session.user.id }
    if (formId) where.formId = formId

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: { form: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ])

    return NextResponse.json({
      leads,
      total,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Leads fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

// Public endpoint for form submissions
export async function POST(req: Request) {
  try {
    const { formId, email, name, phone, metadata, source } = await req.json()

    if (!formId || !email) {
      return NextResponse.json(
        { error: 'Form ID and email required' },
        { status: 400 }
      )
    }

    // Get the form and its owner
    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: { userId: true, successMessage: true },
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // Check if user can create more leads
    const canCreate = await canCreateLead(form.userId)
    if (!canCreate) {
      return NextResponse.json(
        { error: 'Lead limit reached. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    // Check for duplicate email in this form
    const existing = await prisma.lead.findFirst({
      where: { formId, email },
    })

    if (existing) {
      return NextResponse.json({
        success: true,
        message: form.successMessage,
        duplicate: true,
      })
    }

    // Create the lead
    const lead = await prisma.lead.create({
      data: {
        email,
        name,
        phone,
        metadata,
        source,
        formId,
        userId: form.userId,
      },
    })

    // Send webhook notifications
    sendWebhooks(form.userId, 'lead.created', {
      id: lead.id,
      email: lead.email,
      name: lead.name,
      phone: lead.phone,
      formId: lead.formId,
      createdAt: lead.createdAt,
    }).catch(console.error)

    return NextResponse.json({
      success: true,
      message: form.successMessage,
    })
  } catch (error) {
    console.error('Lead creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
