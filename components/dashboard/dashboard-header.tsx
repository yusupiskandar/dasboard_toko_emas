"use client"

import { IconCalendar, IconDownload } from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DashboardHeader() {
  const handleExport = () => {
    toast.success("Mengekspor data penjualan ke CSV...", {
      description: "Laporan penjualan Anda sedang disiapkan untuk diunduh.",
    })
  }

  return (
    <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Dashboard Penjualan
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ringkasan performa penjualan hari ini dan tren Mei 2026.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Date Filter Selector (Dummy UI) */}
        <Select defaultValue="mei-2026">
          <SelectTrigger className="w-[180px] h-10 border-muted bg-background/50 focus-visible:ring-primary/50 focus-visible:border-primary">
            <IconCalendar className="size-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Pilih Periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hari-ini">Hari Ini</SelectItem>
            <SelectItem value="minggu-ini">Minggu Ini</SelectItem>
            <SelectItem value="mei-2026">Mei 2026</SelectItem>
            <SelectItem value="tahun-ini">Tahun Ini</SelectItem>
          </SelectContent>
        </Select>

        {/* Export Button (Dummy UI) */}
        <Button
          variant="outline"
          onClick={handleExport}
          className="h-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 border-muted font-medium"
        >
          <IconDownload className="size-4 mr-1.5" />
          Ekspor Data
        </Button>
      </div>
    </div>
  )
}
