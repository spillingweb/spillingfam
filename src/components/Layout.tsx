import { Outlet, Link, useLocation } from '@tanstack/react-router'
import {
  Home,
  BookOpen,
  Map as MapIcon,
  Archive as ArchiveIcon,
  Users,
  User,
  // LogOut,
  LogIn,
  Moon,
  Sun,
  Clock,
} from 'lucide-react'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  // UserButton,
  // useAuth,
} from '@clerk/clerk-react'
import { useState } from 'react'
import { useDarkMode } from '../hooks/useDarkMode'
import { MobileNav } from './MobileNav'
import { HamburgerButton } from './HamburgerButton'

export function Layout() {
  const location = useLocation()
  // const { isSignedIn } = useAuth()
  const isHomePage = location.pathname === '/'
  const { isDark, toggleDarkMode, mounted } = useDarkMode()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Hjem', icon: Home },
    { path: '/historie', label: 'Historie', icon: Clock },
    { path: '/slektstre', label: 'Slektstre', icon: Users },
    { path: '/arkiv', label: 'Arkiv', icon: ArchiveIcon },
    { path: '/kart', label: 'Kart', icon: MapIcon },
    { path: '/oppskrifter', label: 'Oppskrifter', icon: BookOpen },
  ]

  return (
    <div
      className={`${isHomePage ? 'h-dvh overflow-hidden' : 'min-h-screen bg-background'}`}
    >
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isHomePage
            ? 'bg-transparent'
            : 'bg-accent/95 backdrop-blur-md border-b border-accent shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="group">
              <div
                className={`transition-colors flex flex-col gap-1 ${
                  isHomePage ? 'text-white drop-shadow-lg' : 'text-accent-foreground'
                }`}
              >
                <div className="font-heading text-3xl tracking-tight">
                  Spilling
                </div>
                <div className="font-heading text-xs tracking-[0.3em] -mt-1 opacity-80">
                  ANNO 1917
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 transition-all font-medium flex items-center gap-2 text-sm no-underline ${
                      isActive
                        ? isHomePage
                          ? 'text-white underline underline-offset-4'
                          : 'bg-background text-foreground'
                        : isHomePage
                          ? 'text-white/90 hover:text-white'
                          : 'text-accent-foreground/80 hover:text-accent-foreground hover:bg-background/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2.5 transition-all ${
                  isHomePage
                    ? 'text-white/90 hover:text-white'
                    : 'text-accent-foreground/80 hover:text-accent-foreground hover:bg-background/30'
                }`}
                aria-label="Toggle dark mode"
                suppressHydrationWarning
              >
                {mounted && (isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                ))}
                {!mounted && <Moon className="w-5 h-5" />}
              </button>

              {/* Hamburger Button for Mobile */}
              <HamburgerButton
                onClick={() => setIsMobileMenuOpen(true)}
                isHomePage={isHomePage}
              />

              {/* Desktop Profile & Auth */}
              <SignedIn>
                <Link
                  to="/profil"
                  className={`hidden md:block p-2.5 transition-all no-underline ${
                    location.pathname === '/profil'
                      ? 'bg-background text-foreground'
                      : isHomePage
                        ? 'text-white/90 hover:text-white'
                        : 'text-accent-foreground/80 hover:text-accent-foreground hover:bg-background/30'
                  }`}
                >
                  <User className="w-5 h-5" />
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    className={`hidden md:flex px-4 py-2 transition-all font-medium items-center gap-2 ${
                      isHomePage
                        ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    Logg inn
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
      />

      {/* Main Content */}
      <main
        className={`relative z-10 ${isHomePage ? 'h-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32'}`}
      >
        <Outlet />
      </main>

      {/* Footer */}
      {!isHomePage && (
        <footer className="relative z-10 mt-20">
          <div
            className="bg-muted py-8"
            style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 100%)' }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-card-foreground font-medium">
                © {new Date().getFullYear()}{' '}
                <a href="https://spillingweb.com">Spilling Web</a>. Alle
                rettigheter reservert.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
