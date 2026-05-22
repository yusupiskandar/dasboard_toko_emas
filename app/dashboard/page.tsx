import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { SalesChart } from "@/components/dashboard/sales-chart"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DashboardHeader />
      <StatsGrid />
      <SalesChart />
    </div>
  )
}
