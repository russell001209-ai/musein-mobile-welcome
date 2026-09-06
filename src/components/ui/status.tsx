"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, AlertTriangle, AlertCircle, Loader2, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const statusVariants = cva(
  "inline-flex items-center justify-center rounded-full",
  {
    variants: {
      variant: {
        neutral: "bg-zinc-500 dark:bg-zinc-400",
        primary: "bg-[var(--primary-color)]",
        secondary: "bg-[var(--secondary-color)]",
        accent: "bg-accent",
        info: "bg-blue-500 dark:bg-blue-400",
        success: "bg-green-500 dark:bg-green-400",
        warning: "bg-yellow-500 dark:bg-yellow-400",
        error: "bg-red-500 dark:bg-red-400",
        loading: "bg-primary",
      },
      size: {
        xs: "size-3",
        sm: "size-4",
        md: "size-5",
        lg: "size-6",
        xl: "size-8",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
)

const iconSizes = {
  xs: "size-2.5",
  sm: "size-3",
  md: "size-3.5",
  lg: "size-4",
  xl: "size-5",
}

type StatusVariant = "neutral" | "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "error" | "loading"

const iconMap: Record<StatusVariant, LucideIcon | null> = {
  neutral: null,
  primary: null,
  secondary: null,
  accent: null,
  info: null,
  success: Check,
  warning: AlertTriangle,
  error: AlertCircle,
  loading: Loader2,
}

export interface StatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {
  opacity?: 25 | 50 | 75 | 100
}

function Status({ className, variant = "neutral", size = "md", opacity = 100, ...props }: StatusProps) {
  const Icon = iconMap[variant as StatusVariant] || null
  const opacityClass = {
    25: "opacity-25 dark:opacity-25",
    50: "opacity-50 dark:opacity-50",
    75: "opacity-75 dark:opacity-75",
    100: "",
  }[opacity]

  return (
    <div className={cn(
        statusVariants({ size }),
        className,
        variant === "loading" && "animate-spin",
        "bg-transparent dark:bg-transparent"
    )}>
      <div
        className={cn(
          statusVariants({ variant, size }),
          opacityClass,
          "text-white absolute",
          className,
          "top-0 bottom-0 right-0 left-0"
        )}
        {...props}
      >
      </div>
      {Icon && <Icon className={cn(iconSizes[size as keyof typeof iconSizes], "absolute")} strokeWidth={3} />}
    </div>
  )
}

export { Status, statusVariants }
