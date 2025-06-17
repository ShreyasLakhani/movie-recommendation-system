'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Movie } from '../services/movies'
import MovieGrid from './MovieGrid'
import RecommendationSection from './RecommendationSection'
import { getPopularMovies } from '../services/movies'
import { LoadingSpinner } from './LoadingSpinner'

interface HomePageClientProps {
  initialPopularMovies: Movie[];
  initialRecommendedMovies: Movie[];
}

export default function HomePageClient({ initialPopularMovies, initialRecommendedMovies }: HomePageClientProps) {

  const { data: session, status } = useSession();

  const [popularMovies, setPopularMovies] = useState<Movie[]>(initialPopularMovies);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>(initialRecommendedMovies);
  const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
  const [loadingLikes, setLoadingLikes] = useState(true);

  // Initialize loading states based on whether initial data was provided by SSR
  const [loadingPopular, setLoadingPopular] = useState(false); // Always false as popular movies are always SSR-fetched
  const [loadingRecommendations, setLoadingRecommendations] = useState(false); // Always false as recommendations are always SSR-fetched initially

  // New states to track if initial data for each section has been loaded
  const [initialPopularLoaded, setInitialPopularLoaded] = useState(initialPopularMovies.length > 0);
  const [initialRecommendationsLoaded, setInitialRecommendationsLoaded] = useState(initialRecommendedMovies.length > 0);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(
    initialPopularMovies.length > 0 && initialRecommendedMovies.length > 0
  ); 

  // Memoized fetch functions
  const fetchPopularMovies = useCallback(async () => {
    // This function should ideally not be called if initialPopularMovies are already loaded from SSR
    // but kept as a fallback or for future dynamic loading.
    setLoadingPopular(true);
    try {
      const movies = await getPopularMovies();
      setPopularMovies(movies);
    } catch (error) {
      setPopularMovies([]);
    } finally {
      setLoadingPopular(false);
      setInitialPopularLoaded(true); // Always mark as loaded after attempt
    }
  }, []);

  const fetchRecommendations = useCallback(async () => {
    if (!session?.user?.email) {
      setRecommendedMovies([]);
      setInitialRecommendationsLoaded(true); // Mark as loaded even if no session
      return;
    }
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
      setInitialRecommendationsLoaded(true); // Always mark as loaded after attempt
    }
  }, [session?.user?.email]);

  const fetchLikedMovies = useCallback(async () => {
    if (!session?.user?.email) {
      setLikedMovies([]);
      setLoadingLikes(false);
      return;
    }
    setLoadingLikes(true);
    try {
      const res = await fetch('/api/likes');
      if (res.ok) {
        const data = await res.json();
        // Filter liked movies based on IDs, then fetch full movie details
        const likedMovieIds = data.likedIds || [];
        const moviesDetailsPromises = likedMovieIds.map(async (id: string) => {
          const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
          if (movieRes.ok) {
            const movieData = await movieRes.json();
            return {
              id: movieData.id.toString(),
              title: movieData.title,
              overview: movieData.overview,
              poster_path: movieData.poster_path,
              backdrop_path: movieData.backdrop_path,
              release_date: movieData.release_date,
              vote_average: movieData.vote_average,
              genre_ids: movieData.genres ? movieData.genres.map((g: any) => g.id) : [],
            };
          }
          return null;
        });
        const fullLikedMovies = (await Promise.all(moviesDetailsPromises)).filter(Boolean);
        setLikedMovies(fullLikedMovies as Movie[]);
      } else {
        console.error('Failed to fetch liked movies');
        setLikedMovies([]);
      }
    } catch (error) {
      console.error('Error fetching liked movies:', error);
      setLikedMovies([]);
    } finally {
      setLoadingLikes(false);
    }
  }, [session?.user?.email]);

  // Effect to perform initial data fetching on component mount
  // This effect runs only ONCE and primarily ensures correct initial state handling for SSR-provided data.
  useEffect(() => {
    // Popular movies are always expected to be present from SSR
    setPopularMovies(initialPopularMovies);
    setInitialPopularLoaded(true);

    // Recommendations are loaded from SSR. If initialRecommendedMovies is empty, it means the server found none.
    setRecommendedMovies(initialRecommendedMovies);
    setInitialRecommendationsLoaded(true);

    // Mark overall initial load complete since both are handled by SSR.
    setIsInitialLoadComplete(true);
  }, [initialPopularMovies, initialRecommendedMovies]); // Depend on initial props to ensure effect re-runs if props change (though unlikely for these initial props)

  // This useEffect will now only serve to update isInitialLoadComplete based on initialPopularLoaded and initialRecommendationsLoaded
  useEffect(() => {
    if (initialPopularLoaded && initialRecommendationsLoaded) {
      setIsInitialLoadComplete(true);
    }
  }, [initialPopularLoaded, initialRecommendationsLoaded]);

  // Effect to re-fetch recommendations dynamically when session changes (after initial load)
  // This handles subsequent re-validations (e.g., when minimizing/restoring tab) and login/logout.
  useEffect(() => {
    // Only run this effect *after* the initial page load is complete
    // and only if the session status changes to authenticated or unauthenticated
    // (to avoid re-fetching during the initial 'loading' status of next-auth).
    if (isInitialLoadComplete) {
      if (status === 'authenticated') {
        // If authenticated and no recommendations are currently loaded, fetch them.
        // This handles cases where SSR didn't provide any or if the user logged in.
        if (recommendedMovies.length === 0) {
          fetchRecommendations();
        }
        fetchLikedMovies(); // Fetch liked movies when authenticated
      } else if (status === 'unauthenticated') {
        // If unauthenticated, clear recommendations.
        setRecommendedMovies([]);
        setLoadingRecommendations(false);
        setLikedMovies([]); // Clear liked movies if unauthenticated
        setLoadingLikes(false);
      }
    }
  }, [session?.user?.email, status, isInitialLoadComplete, fetchRecommendations, recommendedMovies.length, fetchLikedMovies]);

  // Callback for MovieCard actions (like/unlike)
  const handleMovieAction = useCallback(() => {
    if (session?.user?.email) {
      fetchRecommendations();
      fetchLikedMovies(); // Re-fetch liked movies after any movie action
    }
  }, [session?.user?.email, fetchRecommendations, fetchLikedMovies]);

  // Overall page loading spinner:
  // - Display if the initial data fetching is not yet complete (`!isInitialLoadComplete`)
  // - Display if `next-auth` is in its initial loading phase (`status === 'loading'`)
  if (!isInitialLoadComplete && status === 'loading') {
    return <LoadingSpinner />;
  }

  // Render the content once initial data is loaded and auth status is resolved
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
          <LoadingSpinner />
        ) : (
          <MovieGrid movies={popularMovies} onMovieAction={handleMovieAction} />
        )}
      </section>

      {session && (
        <>
          <RecommendationSection
            recommendedMovies={recommendedMovies}
            onMovieAction={handleMovieAction}
            loading={loadingRecommendations} // Pass loading state to RecommendationSection
          />

          <section>
            <h2 className="text-2xl font-bold mb-6">My Liked Movies</h2> {/* Renamed to My Liked Movies */}
            {loadingLikes ? (
              <LoadingSpinner />
            ) : likedMovies.length > 0 ? (
              <MovieGrid movies={likedMovies} onMovieAction={handleMovieAction} />
            ) : (
              <p className="text-gray-400">You haven't liked any movies yet. Like some movies to see them here!</p>
            )}
          </section>
        </>
      )}
    </div>
  );
} 