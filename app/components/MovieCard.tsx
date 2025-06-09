'use client'
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '../services/movies';
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

// Props interface for the MovieCard component
interface MovieCardProps {
  movie: Movie;
  setRecommendations: React.Dispatch<React.SetStateAction<Movie[]>>;
  onMovieAction?: () => void;
}

// MovieCard component for displaying individual movie information
export default function MovieCard({ movie, onMovieAction }: MovieCardProps) {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div className="relative group" />; // or a skeleton/loading state
  }
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;
    fetch(`/api/likes/${movie.id}`)
      .then(res => res.json())
      .then(data => setLiked(data.liked));
  }, [session?.user?.email, movie.id]);

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      if (liked) {
        await fetch(`/api/likes/${movie.id}`, { method: 'DELETE' });
        setLiked(false);
      } else {
        await fetch(`/api/likes/${movie.id}`, { method: 'POST' });
        setLiked(true);
      }
    } finally {
      setLoading(false);
      if (onMovieAction) {
        onMovieAction();
      }
    }
  };
  
  // Format the release date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    // Use UTC to avoid timezone issues and hydration mismatches
    const date = new Date(dateString + 'T00:00:00Z');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC', // Force UTC to avoid mismatch
    });
  };

  return (
    <div className="relative group rounded-lg overflow-hidden shadow-lg bg-gray-800 transition-transform duration-200 hover:scale-105 hover:shadow-xl w-full max-w-xs mx-auto">
      {/* Like button */}
      {session?.user?.email && (
        <button
          aria-label={liked ? 'Unlike' : 'Like'}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/60 hover:bg-red-600 transition-colors"
          onClick={toggleLike}
        >
          {liked ? (
            <FaHeart className="text-red-500 w-5 h-5" />
          ) : (
            <FiHeart className="text-white w-5 h-5" />
          )}
        </button>
      )}
      <Link href={`/movie/${movie.id}`} className="block focus:outline-none">
        <div className="w-full aspect-[2/3] relative">
          <Image
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` : '/placeholder.png'}
            alt={movie.title}
            fill
            className="object-cover w-full h-full"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 16vw"
            priority={false}
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-3 py-2 flex flex-col gap-1">
            <h3 className="text-base font-bold text-white truncate" title={movie.title}>{movie.title}</h3>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 font-bold text-xs">★ {movie.vote_average?.toFixed(1) ?? 'N/A'}</span>
              <span className="text-gray-300 text-xs">{movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
} 