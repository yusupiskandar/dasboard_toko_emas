"use client"

import { ReactNode } from "react"
import { IconTrendingDown, IconTrendingUp, IconMinus } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: string
  trendDirection?: "up" | "down" | "neutral"
  description?: string
  accentColor?: string // e.g. "blue", "emerald", "amber", "purple"
  className?: string
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  trendDirection = "neutral",
  description,
  accentColor = "primary",
  className,
}: StatsCardProps) {
  // Theme-aware icon box background mapping
  const colorMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary dark:bg-primary/20",
    blue: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20",
    purple: "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20",
  }

  const iconBg = colorMap[accentColor] || colorMap.primary

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card/60 p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-zinc-900/40",
        className
      )}
    >
      {/* Decorative gradient glow */}
      <div
        className={cn(
          "absolute -right-6 -top-6 h-24 w-24 rounded-full blur-xl opacity-20 transition-opacity duration-300",
          accentColor === "primary" && "bg-primary",
          accentColor === "blue" && "bg-blue-500",
          accentColor === "emerald" && "bg-emerald-500",
          accentColor === "amber" && "bg-amber-500",
          accentColor === "purple" && "bg-purple-500"
        )}
      />

      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium tracking-wide text-muted-foreground">
          {title}
        </span>
        <div className={cn("rounded-lg p-2.5 transition-transform duration-300 hover:scale-105", iconBg)}>
          {icon}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {value}
        </h3>

        {(trend || description) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <Badge
                variant="outline"
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium",
                  trendDirection === "up" &&
                    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
                  trendDirection === "down" &&
                    "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
                  trendDirection === "neutral" &&
                    "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                )}
              >
                {trendDirection === "up" && <IconTrendingUp className="size-3" />}
                {trendDirection === "down" && <IconTrendingDown className="size-3" />}
                {trendDirection === "neutral" && <IconMinus className="size-3" />}
                {trend}
              </Badge>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
