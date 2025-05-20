'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Movie } from '../services/movies'

interface MovieGridProps {
  movies: Movie[]
}

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {movies.map((movie) => {
        return (
          <div key={movie.id} className="relative group">
            <Link
              href={`/movie/${movie.id}`}
              className="group relative rounded-lg overflow-hidden bg-[#1e293b] hover:ring-2 hover:ring-purple-500 transition-all duration-300"
            >
              <div className="aspect-[2/3] relative">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                      {movie.vote_average.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
} 