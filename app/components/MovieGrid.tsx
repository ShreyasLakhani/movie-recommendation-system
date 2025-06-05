'use client'

import { Movie } from '../services/movies'
import MovieCard from './MovieCard'

interface MovieGridProps {
  movies: Movie[]
  setRecommendations?: React.Dispatch<React.SetStateAction<Movie[]>>
  onMovieAction?: () => void
}

export default function MovieGrid({ movies, setRecommendations, onMovieAction }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2 sm:p-4 md:p-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          setRecommendations={setRecommendations || (() => {})}
          onMovieAction={onMovieAction}
        />
      ))}
    </div>
  )
} 