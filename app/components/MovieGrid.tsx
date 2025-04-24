import { Movie } from '../services/tmdb';
import MovieCard from './MovieCard';

// Props interface for the MovieGrid component
interface MovieGridProps {
  movies: Movie[];
  title: string;
}

// MovieGrid component for displaying a collection of movies
export default function MovieGrid({ movies, title }: MovieGridProps) {
  if (!movies || movies.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-400">No movies found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
} 