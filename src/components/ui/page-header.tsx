import type { ReactNode } from "react"
import { Heading } from "./heading"

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <Heading level="h2"> {title}</Heading>
        {description && (
          <p className="text-lg text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="self-start lg:self-auto">{action}</div>}
    </div>
  )
}
