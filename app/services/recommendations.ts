import prisma from '@/app/lib/prisma'
import { Movie } from './movies'

export async function getRecommendationsForUser(email: string): Promise<Movie[]> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { 
      watchlist: true // Only use watchlist
    }
  })

  const watchlistMovies = user?.watchlist || [];

  if (watchlistMovies.length === 0) {
    return fetchRandomPopularMovies();
  }

  // Extract genre_ids from each movie in the watchlist
  const genreIds = watchlistMovies.flatMap((movie: any) => Array.isArray(movie.genre_ids) ? movie.genre_ids : []);
  const uniqueGenreIds = [...new Set(genreIds)];

  return fetchRecommendationsBasedOnGenres(uniqueGenreIds);
}

async function fetchRecommendationsBasedOnGenres(genres: number[]): Promise<Movie[]> {
  if (genres.length === 0) {
    return [];
  }

  const genreIds = genres.join(',');
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreIds}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch recommendations');
  }

  const data = await response.json();
  return data.results;
}

async function fetchRandomPopularMovies(): Promise<Movie[]> {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch random popular movies');
  }

  const data = await response.json();
  return data.results.slice(0, 5);
}
