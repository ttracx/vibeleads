import { LeadsTable } from '@/components/dashboard/leads-table'

export default function LeadsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600">View and export all your captured leads</p>
      </div>

      <LeadsTable />
    </div>
  )
}
