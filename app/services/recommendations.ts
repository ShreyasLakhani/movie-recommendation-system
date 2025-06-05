import prisma from '@/app/lib/prisma'
import { Movie } from './movies'

// Helper to fetch popular movies
async function fetchPopularMovies(count: number): Promise<Movie[]> {
  const apiKey = process.env.TMDB_API_KEY;
  const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results.slice(0, count);
}

// Helper to fetch recommendations by genre
async function fetchRecommendationsByGenres(genreIds: number[], count: number): Promise<Movie[]> {
  const apiKey = process.env.TMDB_API_KEY;
  const genreString = genreIds.join(',');
  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&with_genres=${genreString}&sort_by=popularity.desc&page=1`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results.slice(0, count);
}

export async function getRecommendationsForUser(email: string): Promise<Movie[]> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { 
      watchlist: true,
      likes: true,
    },
  });
  const watchlist = user?.watchlist || [];
  const likes = user?.likes || [];
  const allMovies = [...watchlist, ...likes];
  if (allMovies.length === 0) {
    return fetchPopularMovies(5);
  }
  // Collect all genre_ids from movies
  const genreIds = Array.from(new Set(allMovies.flatMap((movie: any) => movie.genre_ids || [])));
  if (genreIds.length === 0) {
    return fetchPopularMovies(5);
  }
  return fetchRecommendationsByGenres(genreIds, 5);
}
