'use client'

import { Movie } from '../services/movies'
import MovieGrid from './MovieGrid'
import { LoadingSpinner } from './LoadingSpinner'

interface RecommendationSectionProps {
  onMovieAction?: () => void; // Callback to refresh recommendations
  recommendedMovies: Movie[]; // Now directly receives recommended movies
  loading?: boolean; // Now directly receives loading state
}

export default function RecommendationSection({ onMovieAction, recommendedMovies, loading }: RecommendationSectionProps) {
  // Expose a function to refresh recommendations for child components
  const handleMovieAction = () => {
    if (onMovieAction) {
      onMovieAction();
    }
  }

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
        <div className="flex justify-center items-center min-h-[200px]">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (recommendedMovies.length === 0) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
        <p className="text-gray-400">No recommendations found. Try liking some movies or adding them to your watchlist!</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
      <MovieGrid movies={recommendedMovies} onMovieAction={handleMovieAction} />
    </section>
  );
} 