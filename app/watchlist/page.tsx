'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Movie } from '../services/movies'
import MovieGrid from '../components/MovieGrid'

export default function WatchlistPage() {
  const { data: session } = useSession()
  const [watchlist, setWatchlist] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWatchlist() {
      try {
        const res = await fetch('/api/watchlist')
        if (res.ok) {
          const data = await res.json()
          setWatchlist(data)
        }
      } catch (error) {
        console.error('Failed to fetch watchlist:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchWatchlist()
    }
  }, [session])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Watchlist</h1>
      </div>

      {watchlist.length > 0 ? (
        <MovieGrid movies={watchlist} />
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-400 mb-4">Your watchlist is empty</h3>
          <p className="text-gray-500">
            Start adding movies to your watchlist to keep track of what you want to watch
          </p>
        </div>
      )}
    </div>
  )
} 