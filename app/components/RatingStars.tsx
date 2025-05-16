'use client'
import { useState, useEffect } from 'react'

interface RatingStarsProps {
  movieId: string
  onRated?: (newRating: number) => void
}

export default function RatingStars({ movieId, onRated }: RatingStarsProps) {
  const [hover, setHover] = useState(0)
  const [value, setValue] = useState(0)

  // fetch initial rating
  useEffect(() => {
    fetch(`/api/movies/${movieId}/rating`)
      .then(res => res.json())
      .then(data => setValue(data.myRating))
      .catch(() => {})
  }, [movieId])

  const submit = async (newVal: number) => {
    setValue(newVal)
    try {
      await fetch(`/api/movies/${movieId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newVal })
      })
      onRated?.(newVal)
    } catch {
      // handle error
    }
  }

  return (
    <div className="flex space-x-1 text-xl">
      {[...Array(10)].map((_, i) => {
        const starValue = i + 1
        return (
          <span
            key={i}
            className={
              (hover || value) >= starValue
                ? 'cursor-pointer text-yellow-400'
                : 'cursor-pointer text-gray-500'
            }
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            onClick={() => submit(starValue)}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}
