'use client';

import { useEffect, useState } from 'react';
import { Movie, searchMovies } from './services/tmdb';
import MovieGrid from './components/MovieGrid';
import SearchBar from './components/SearchBar';

export default function Home() {
  // State for movies and loading status
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);

  // Fetch from your own DB endpoint now
  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        const res = await fetch('/api/movies');
        if (!res.ok) throw new Error('Failed to load movies');
        const data: Movie[] = await res.json();
        setMovies(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  // Handle search functionality
  const handleSearch = async (query: string) => {
    try {
      setSearching(true);
      const data = await searchMovies(query);
      setSearchResults(data.results);
      setSearching(false);
    } catch (err) {
      console.error('Error searching movies:', err);
      setSearching(false);
    }
  };

  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Movie Recommendation System</h1>
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
          <h1 className="text-3xl font-bold mb-8">Movie Recommendation System</h1>
          <div className="bg-red-900 text-white p-4 rounded-lg">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Movie Recommendation System</h1>
        
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />
        
        {/* Display search results if available, otherwise show popular movies */}
        {searching ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <MovieGrid movies={searchResults} title="Search Results" />
        ) : (
          <MovieGrid movies={movies} title="Popular Movies" />
        )}
      </div>
    </div>
  );
}
