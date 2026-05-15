import { Link, useLocation } from '@tanstack/react-router'
import {
  Home,
  BookOpen,
  Map as MapIcon,
  Archive as ArchiveIcon,
  Users,
  User,
  X,
  LogIn,
} from 'lucide-react'
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { Heading } from '@/components/ui/heading'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  navItems: Array<{
    path: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }>
}

export function MobileNav({ isOpen, onClose, navItems }: MobileNavProps) {
  const location = useLocation()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-card border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Heading level="h4" className="font-semibold">
              Meny
            </Heading>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all no-underline ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <SignedIn>
              <Link
                to="/profile"
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all no-underline ${
                  location.pathname === '/profile'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profil</span>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium">
                  <LogIn className="w-5 h-5" />
                  <span>Logg inn</span>
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </>
  )
}
