'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { addToWatchlist, removeFromWatchlist } from '@/app/services/watchlist'

interface Props {
  movieId: number
  initialInWatchlist?: boolean
  onChange?: (newList: any[]) => void
}

export default function WatchlistButton({
  movieId,
  initialInWatchlist = false,
  onChange,
}: Props) {
  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist)
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const fn = inWatchlist ? removeFromWatchlist : addToWatchlist
      const updated = await fn(movieId)
      setInWatchlist(!inWatchlist)
      onChange?.(updated)
      toast.success(inWatchlist ? 'Removed from watchlist' : 'Added to watchlist')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
    >
      {loading
        ? 'Processing…'
        : inWatchlist
        ? 'Remove from Watchlist'
        : 'Add to Watchlist'}
    </button>
  )
}
