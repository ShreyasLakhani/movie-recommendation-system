'use client';

import { use, useEffect, useState } from 'react';
import { MovieDetail, Genre } from '@/app/services/tmdb';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import WatchlistButton from '@/app/components/WatchlistButton';

// Movie details page component
export default function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // If still loading session or not authenticated, show loading state
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // unwrap the Promise
  const { id } = use(params);

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inWatchlist, setInWatchlist] = useState(false);

  // Fetch movie details on component mount
  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setLoading(true);
        const res = await fetch(`/api/movies/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const movieData = await res.json();
        setMovie(movieData);
        setError(null);
        setInWatchlist(movieData.inWatchlist);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetails();
  }, [id]);

  // After that, add this effect to fetch the user's watchlist and
  //    initialize `inWatchlist` properly:
  useEffect(() => {
    async function checkWatchlist() {
      if (!session) return
      try {
        const res = await fetch('/api/watchlist')
        if (!res.ok) return
        const list: { id: string | number }[] = await res.json()
        setInWatchlist(list.some(m => m.id.toString() === id))
      } catch (err) {
        console.error('Failed to check watchlist status', err)
      }
    }
    checkWatchlist()
  }, [session, id])

  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900 text-white p-4 rounded-lg">
            <p>{error}</p>
          </div>
          <Link href="/" className="mt-4 inline-block text-blue-400 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  // If no movie found
  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 text-white p-4 rounded-lg">
            <p>Movie not found.</p>
          </div>
          <Link href="/" className="mt-4 inline-block text-blue-400 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  // Format runtime to hours and minutes
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero section with backdrop image */}
      <div className="relative h-[50vh] w-full">
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
      </div>

      {/* Movie details */}
      <div className="max-w-7xl mx-auto px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-64 h-96 flex-shrink-0 mx-auto md:mx-0">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={256}
                height={384}
                className="rounded-lg shadow-lg"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No poster available</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            
            {movie.tagline && (
              <p className="text-xl text-gray-400 mt-2 italic">{movie.tagline}</p>
            )}
            
            <div className="flex flex-wrap gap-2 mt-4">
              {movie.genres?.map((genre: Genre) => (
                <span 
                  key={genre.id} 
                  className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-400 text-sm">Release Date</h3>
                <p>{formatDate(movie.release_date)}</p>
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm">Runtime</h3>
                <p>{movie.runtime ? formatRuntime(movie.runtime) : 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm">Budget</h3>
                <p>{formatCurrency(movie.budget)}</p>
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm">Revenue</h3>
                <p>{formatCurrency(movie.revenue)}</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2">Overview</h3>
              <p className="text-gray-300 leading-relaxed">{movie.overview || 'No overview available.'}</p>
            </div>
            
            <WatchlistButton
              movieId={Number(id)}
              initialInWatchlist={inWatchlist}
              onChange={updatedList =>
                setInWatchlist(updatedList.some(m => m.id.toString() === id))
              }
            />
            
            <Link href="/" className="mt-8 inline-block text-blue-400 hover:underline">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 