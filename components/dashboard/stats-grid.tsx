"use client"

import {
  IconCalendarStats,
  IconCoin,
  IconPackage,
  IconWallet,
} from "@tabler/icons-react"

import { salesSummary } from "@/lib/dummy/sales-summary"
import { StatsCard } from "./stats-card"

export function StatsGrid() {
  // Format to Indonesian Rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Penjualan Hari Ini */}
      <StatsCard
        title="Penjualan Hari Ini"
        value={formatRupiah(salesSummary.todaySales)}
        icon={<IconCalendarStats className="size-5" />}
        trend="+8.2%"
        trendDirection="up"
        description="vs kemarin"
        accentColor="primary"
      />

      {/* Barang Terjual */}
      <StatsCard
        title="Barang Terjual"
        value={`${salesSummary.soldItems} Pcs`}
        icon={<IconPackage className="size-5" />}
        trend="+12.5%"
        trendDirection="up"
        description="vs kemarin"
        accentColor="blue"
      />

      {/* Penjualan Kotor */}
      <StatsCard
        title="Penjualan Kotor"
        value={formatRupiah(salesSummary.grossSales)}
        icon={<IconCoin className="size-5" />}
        trend="+5.4%"
        trendDirection="up"
        description="vs kemarin"
        accentColor="amber"
      />

      {/* Penjualan Bersih */}
      <StatsCard
        title="Penjualan Bersih"
        value={formatRupiah(salesSummary.netSales)}
        icon={<IconWallet className="size-5" />}
        trend="+6.8%"
        trendDirection="up"
        description="vs kemarin"
        accentColor="emerald"
      />
    </div>
  )
}
