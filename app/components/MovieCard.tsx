'use client'
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '../services/tmdb';
import { useSession } from 'next-auth/react'

// Props interface for the MovieCard component
interface MovieCardProps {
  movie: Movie;
  setRecommendations: React.Dispatch<React.SetStateAction<Movie[]>>;
}

// MovieCard component for displaying individual movie information
export default function MovieCard({ movie }: MovieCardProps) {

  // Base URL for TMDB image paths
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  
  // Format the release date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="relative group">
      <Link href={`/movie/${movie.id}`}>
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl">
          <div className="relative h-80 w-full">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">{imageBaseUrl}</span>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-bold text-white truncate">{movie.title}</h3>
            
            <div className="flex items-center mt-2">
              <div className="flex items-center bg-yellow-600 rounded px-2 py-1">
                <span className="text-white text-sm font-medium">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
              <span className="ml-2 text-gray-400 text-sm">
                {formatDate(movie.release_date)}
              </span>
            </div>
            
            <p className="text-gray-400 mt-2 text-sm line-clamp-2">
              {movie.overview || 'No description available.'}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
} 