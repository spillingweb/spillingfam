import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface HeadingProps {
  level: "h1" | "h2" | "h3" | "h4"
  children: ReactNode
  className?: string
}

const sizeClasses = {
  h1: "text-5xl",
  h2: "text-4xl",
  h3: "text-2xl",
  h4: "text-xl",
}

export function Heading({ level, children, className }: HeadingProps) {
  const Component = level
  
  return (
    <Component
      className={cn(
        "font-heading text-foreground",
        sizeClasses[level],
        className
      )}
    >
      {children}
    </Component>
  )
}
