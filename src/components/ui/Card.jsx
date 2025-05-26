import React from "react"
import { cn } from "../../utils/cn"

export const Card = ({ className, ...props }) => (
  <div
    className={cn(
      "rounded-lg border border-gray-200 bg-white text-card-foreground shadow-lg", // 👈 sombra + borde gris claro
      className
    )}
    {...props}
  />
)


export const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 pt-6 pl-6 pr-6 pb-4", className)} {...props} />
)

export const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight pb-2", className)} {...props} />
)

export const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-gray-500", className)} {...props} />
)

export const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
)
