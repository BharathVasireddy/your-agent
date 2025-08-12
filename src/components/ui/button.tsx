import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Use brand tokens to avoid reliance on hsl() custom props
        default: "bg-brand text-white hover:bg-brand-hover",
        destructive: "bg-red-700 text-white hover:bg-red-800",
        outline: "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50",
        secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
        ghost: "text-zinc-900 hover:bg-zinc-100",
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[var(--btn-height-md)] px-[var(--btn-padding-x-md)] py-[var(--btn-padding-y-md)]",
        sm: "h-[var(--btn-height-sm)] rounded-md px-[var(--btn-padding-x-sm)] py-[var(--btn-padding-y-sm)]",
        lg: "h-[var(--btn-height-lg)] rounded-md px-[var(--btn-padding-x-lg)] py-[var(--btn-padding-y-lg)]",
        icon: "h-[var(--btn-height-md)] w-[var(--btn-height-md)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

 
