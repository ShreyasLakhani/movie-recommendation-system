'use client'

import { Movie } from '../services/movies'
import MovieGrid from './MovieGrid'

interface RecommendationSectionProps {
  onMovieAction?: () => void; // Callback to refresh recommendations
  recommendedMovies: Movie[]; // Now directly receives recommended movies
  loading: boolean; // Now directly receives loading state
}

export default function RecommendationSection({ onMovieAction, recommendedMovies, loading }: RecommendationSectionProps) {
  // Expose a function to refresh recommendations for child components
  const handleMovieAction = () => {
    if (onMovieAction) {
      onMovieAction();
    }
  }

  if (loading) {
    return <div>Loading recommendations...</div>; // Simple loading state
  }

  if (recommendedMovies.length === 0) {
    return <p className="text-gray-400">No recommendations found. Try liking some movies or adding them to your watchlist!</p>;
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
      <MovieGrid movies={recommendedMovies} onMovieAction={handleMovieAction} />
    </section>
  );
} 