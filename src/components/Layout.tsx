import { Outlet, Link, useLocation } from '@tanstack/react-router'
import {
  Home,
  BookOpen,
  Map as MapIcon,
  Archive as ArchiveIcon,
  Users,
  User,
  LogOut,
  LogIn,
} from 'lucide-react'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
} from '@clerk/clerk-react'

export function Layout() {
  const location = useLocation()
  const { isSignedIn } = useAuth()
  const isHomePage = location.pathname === '/'

  const navItems = [
    { path: '/', label: 'Hjem', icon: Home },
    { path: '/stories', label: 'Historier', icon: BookOpen },
    { path: '/recipes', label: 'Oppskrifter', icon: BookOpen },
    { path: '/map', label: 'Kart', icon: MapIcon },
    { path: '/archive', label: 'Arkiv', icon: ArchiveIcon },
    { path: '/family-tree', label: 'Slektstre', icon: Users },
  ]

  return (
    <div
      className={`${isHomePage ? 'h-dvh overflow-hidden' : 'min-h-screen bg-[#B4EDCE]/30'}`}
    >
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isHomePage
            ? 'bg-transparent'
            : 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="group">
              <div
                className={`transition-colors ${
                  isHomePage ? 'text-white drop-shadow-lg' : 'text-gray-900'
                }`}
              >
                <div className="font-serif text-3xl tracking-tight">
                  Spilling
                </div>
                <div className="font-serif text-xs tracking-[0.3em] -mt-1 opacity-80">
                  ANNO 1917
                </div>
              </div>
            </Link>

            <nav className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 transition-all font-medium flex items-center gap-2 text-sm ${
                      isActive
                        ? isHomePage
                          ? 'text-white underline underline-offset-4'
                          : 'bg-[#B4EDCE] text-gray-900'
                        : isHomePage
                          ? 'text-white/90 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-2">
              <SignedIn>
                <Link
                  to="/profile"
                  className={`p-2.5 transition-all ${
                    location.pathname === '/profile'
                      ? 'bg-[#B3E9F5] text-gray-900'
                      : isHomePage
                        ? 'text-white/90 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5" />
                </Link>
                <div
                  className={`${
                    isHomePage
                      ? '[&_.cl-userButtonTrigger]:text-white [&_.cl-userButtonTrigger]:hover:text-white'
                      : '[&_.cl-userButtonTrigger]:text-gray-600'
                  }`}
                >
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonAvatarBox: 'w-9 h-9',
                      },
                    }}
                  />
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    className={`px-4 py-2 transition-all font-medium flex items-center gap-2 ${
                      isHomePage
                        ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                        : 'bg-[#F28B1D] text-white hover:bg-[#D45E4C]'
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
            className="bg-[#B4EDCE] py-8"
            style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 100%)' }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-gray-800 font-medium">
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
