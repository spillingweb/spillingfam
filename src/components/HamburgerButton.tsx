import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HamburgerButtonProps {
  onClick: () => void
  isHomePage: boolean
}

export function HamburgerButton({ onClick, isHomePage }: HamburgerButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="md:hidden"
      variant="ghost"
      size="icon-sm"
      aria-label="Open menu"
    >
      <Menu className="w-6 h-6" />
    </Button>
  )
}
