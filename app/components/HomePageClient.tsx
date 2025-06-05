'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Movie } from '../services/movies'
import MovieGrid from './MovieGrid'
import RecommendationSection from './RecommendationSection'
import { getPopularMovies } from '../services/movies'

interface HomePageClientProps {
  initialPopularMovies: Movie[];
  initialRecommendedMovies: Movie[];
}

export default function HomePageClient({ initialPopularMovies, initialRecommendedMovies }: HomePageClientProps) {
  const { data: session } = useSession();
  const [popularMovies, setPopularMovies] = useState<Movie[]>(initialPopularMovies);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>(initialRecommendedMovies);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [loadingPopular, setLoadingPopular] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    if (!session?.user?.email) {
      setRecommendedMovies([]);
      setLoadingRecommendations(false);
      return;
    }

    setLoadingRecommendations(true);
    try {
      const res = await fetch(`/api/recommendations?email=${session.user.email}`);
      if (res.ok) {
        const data = await res.json();
        setRecommendedMovies(data);
      } else {
        console.error('Failed to fetch recommendations', res.status, await res.text());
        setRecommendedMovies([]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendedMovies([]);
    } finally {
      setLoadingRecommendations(false);
    }
  }, [session?.user?.email]);

  const fetchPopularMovies = useCallback(async () => {
    setLoadingPopular(true);
    try {
      const movies = await getPopularMovies();
      setPopularMovies(movies);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
    } finally {
      setLoadingPopular(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.email && recommendedMovies.length === 0 && initialRecommendedMovies.length === 0) {
      fetchRecommendations();
    }
  }, [session?.user?.email, fetchRecommendations, recommendedMovies.length, initialRecommendedMovies.length]);

  const handleMovieAction = () => {
    if (session?.user?.email) {
      fetchRecommendations();
    }
    fetchPopularMovies();
  };

  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Movies</h2>
          {!session && (
            <p className="text-gray-400">
              Sign in to access more features and personalized recommendations
            </p>
          )}
        </div>
        {loadingPopular ? (
          <div>Loading popular movies...</div>
        ) : (
          <MovieGrid movies={popularMovies} onMovieAction={handleMovieAction} />
        )}
      </section>

      {session && (
        <>
          <RecommendationSection
            recommendedMovies={recommendedMovies}
            onMovieAction={handleMovieAction}
            loading={loadingRecommendations}
          />

          <section>
            <h2 className="text-2xl font-bold mb-6">Continue Watching</h2>
            {loadingPopular ? (
              <div>Loading continue watching...</div>
            ) : (
              <MovieGrid movies={popularMovies.slice(10, 15)} onMovieAction={handleMovieAction} />
            )}
          </section>
        </>
      )}
    </div>
  );
} 