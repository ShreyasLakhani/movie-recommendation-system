'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Movie } from '@/app/services/movies';
import Image from 'next/image';
import Link from 'next/link';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    year: '',
    genre: '',
    rating: '',
  });
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch movies when debounced query changes
  useEffect(() => {
    const searchMovies = async () => {
      if (!debouncedQuery) {
        setMovies([]);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: debouncedQuery,
          ...(filters.year && { year: filters.year }),
          ...(filters.genre && { genre: filters.genre }),
          ...(filters.rating && { rating: filters.rating }),
        });

        const res = await fetch(`/api/search?${params}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [debouncedQuery, filters]);

  // Update URL when query changes
  useEffect(() => {
    if (debouncedQuery) {
      router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`);
    }
  }, [debouncedQuery, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="w-full px-4 py-3 bg-[#1e293b] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <select
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
            className="bg-[#1e293b] text-white rounded-lg px-4 py-2"
          >
            <option value="">Release Year</option>
            {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={filters.genre}
            onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
            className="bg-[#1e293b] text-white rounded-lg px-4 py-2"
          >
            <option value="">Genre</option>
            <option value="28">Action</option>
            <option value="12">Adventure</option>
            <option value="16">Animation</option>
            <option value="35">Comedy</option>
            <option value="80">Crime</option>
            <option value="99">Documentary</option>
            <option value="18">Drama</option>
            <option value="10751">Family</option>
            <option value="14">Fantasy</option>
            <option value="36">History</option>
            <option value="27">Horror</option>
            <option value="10402">Music</option>
            <option value="9648">Mystery</option>
            <option value="10749">Romance</option>
            <option value="878">Science Fiction</option>
            <option value="10770">TV Movie</option>
            <option value="53">Thriller</option>
            <option value="10752">War</option>
            <option value="37">Western</option>
          </select>

          <select
            value={filters.rating}
            onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
            className="bg-[#1e293b] text-white rounded-lg px-4 py-2"
          >
            <option value="">Rating</option>
            <option value="9">9+ ⭐</option>
            <option value="8">8+ ⭐</option>
            <option value="7">7+ ⭐</option>
            <option value="6">6+ ⭐</option>
            <option value="5">5+ ⭐</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="group bg-[#1e293b] rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200"
            >
              <div className="relative aspect-[2/3]">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
                  <div>
                    <h3 className="text-white font-semibold">{movie.title}</h3>
                    <p className="text-gray-300 text-sm">
                      {new Date(movie.release_date).getFullYear()} • ⭐ {movie.vote_average.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && movies.length === 0 && query && (
        <div className="text-center text-gray-400 py-12">
          No movies found for "{query}"
        </div>
      )}
    </div>
  );
} 