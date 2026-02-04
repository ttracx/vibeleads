import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const formId = searchParams.get('formId')

    const where: Record<string, unknown> = { userId: session.user.id }
    if (formId) where.formId = formId

    const leads = await prisma.lead.findMany({
      where,
      include: { form: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })

    // Generate CSV
    const headers = ['Email', 'Name', 'Phone', 'Form', 'Source', 'Created At']
    const rows = leads.map((lead) => [
      lead.email,
      lead.name || '',
      lead.phone || '',
      lead.form.name,
      lead.source || '',
      new Date(lead.createdAt).toISOString(),
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-${Date.now()}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 })
  }
}
