'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Movie } from './services/tmdb';
import MovieGrid from './components/MovieGrid';
import SearchBar from './components/SearchBar';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Local UI state
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);

  // 1) Redirect unauthenticated users to /login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 2) Once authenticated, fetch movies from your API
  useEffect(() => {
    if (status !== 'authenticated') return;

    async function fetchMovies() {
      try {
        setLoading(true);
        const res = await fetch('/api/movies');
        if (!res.ok) throw new Error('Failed to load movies');
        const data: Movie[] = await res.json();
        setMovies(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [status]);

  // 3) Show a full-screen spinner while NextAuth is figuring out session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  // 4) Show movie-fetch loading / error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-8">Movie Recommendation System</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-8">Movie Recommendation System</h1>
        <div className="bg-red-900 p-4 rounded">{error}</div>
      </div>
    );
  }

  // 5) Finally render your protected UI
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Movie Recommendation System</h1>
        <SearchBar onSearch={async (query) => {
          setSearching(true);
          const data = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
            .then((r) => r.json());
          setSearchResults(data.results);
          setSearching(false);
        }} />
        {searching ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : searchResults.length ? (
          <MovieGrid movies={searchResults} title="Search Results" />
        ) : (
          <MovieGrid movies={movies} title="Popular Movies" />
        )}
      </div>
    </div>
  );
}
