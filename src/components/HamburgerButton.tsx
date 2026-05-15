import { Menu } from 'lucide-react'

interface HamburgerButtonProps {
  onClick: () => void
  isHomePage: boolean
}

export function HamburgerButton({ onClick, isHomePage }: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`md:hidden p-2.5 transition-all ${
        isHomePage
          ? 'text-white/90 hover:text-white'
          : 'text-accent-foreground/80 hover:text-accent-foreground hover:bg-background/30'
      }`}
      aria-label="Open menu"
    >
      <Menu className="w-6 h-6" />
    </button>
  )
}
