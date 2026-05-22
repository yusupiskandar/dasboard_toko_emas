"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { salesMay2026 } from "@/lib/dummy/sales-may-2026"

const chartConfig = {
  total: {
    label: "Penjualan",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function SalesChart() {
  // Format to Indonesian Rupiah compact (e.g. 5jt)
  const formatCompactRupiah = (value: number) => {
    return `Rp ${(value / 1000000).toFixed(1)}jt`
  }

  // Format to full Indonesian Rupiah
  const formatFullRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card className="rounded-xl border bg-card/40 shadow-xs backdrop-blur-md dark:bg-zinc-900/20">
      <CardHeader className="border-b pb-4">
        <div>
          <CardTitle className="text-lg font-bold text-foreground">
            Grafik Penjualan Mei 2026
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Tren penjualan harian tanggal 1–31 Mei 2026
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-6 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart
            data={salesMay2026}
            margin={{
              left: 12,
              right: 12,
              top: 10,
              bottom: 10,
            }}
          >
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="var(--primary)"
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} className="stroke-muted/30" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.getDate().toString() // Just display the day number: 1, 2, ..., 31
              }}
              className="text-xs text-muted-foreground font-medium"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatCompactRupiah}
              className="text-xs text-muted-foreground font-medium font-mono"
            />
            <ChartTooltip
              cursor={{ stroke: "var(--primary)", strokeWidth: 1, strokeDasharray: "4 4" }}
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="font-semibold text-foreground font-mono">
                      {formatFullRupiah(Number(value))}
                    </span>
                  )}
                  labelFormatter={(label) => {
                    const date = new Date(label)
                    return date.toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              name="total"
              dataKey="total"
              type="monotone"
              fill="url(#fillTotal)"
              stroke="var(--primary)"
              strokeWidth={2}
              activeDot={{
                r: 6,
                style: { fill: "var(--primary)", opacity: 0.9 },
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
