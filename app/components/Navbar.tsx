'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { FiSearch, FiUser, FiLogOut, FiSettings, FiList } from 'react-icons/fi'

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    if (!session) {
      router.push('/login')
      return
    }

    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-[#0f172a] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              Tasteful Picks
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1e293b] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </form>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/watchlist"
                  className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  <FiList className="mr-2" />
                  Watchlist
                </Link>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center text-gray-300 hover:text-white p-1 rounded-full hover:bg-gray-700"
                  >
                    <FiUser className="h-6 w-6" />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 w-48 mt-2 py-2 bg-[#1e293b] rounded-lg shadow-xl z-50">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-purple-600 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiUser className="mr-2" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-purple-600 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiSettings className="mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-purple-600 hover:text-white"
                      >
                        <FiLogOut className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 