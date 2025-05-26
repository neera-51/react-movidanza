import React from "react"
import { cn } from "../../utils/cn"

export const Button = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default:
        "bg-black text-white hover:bg-neutral-800 hover:shadow-md transition-colors duration-150",
      outline:
        "border border-gray-300 text-black hover:bg-gray-100 hover:border-black transition-colors duration-150",
      red:
        "bg-red-600 text-white hover:bg-red-700 hover:shadow-md transition-colors duration-150",
      purple:
        "bg-morado text-white hover:bg-[#690d9b] hover:shadow-md transition-colors duration-150",
    }

    const base =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2"

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    )
  }
)

