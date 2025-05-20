import prisma from '@/app/lib/prisma'
import { Movie } from './movies'

export async function getRecommendationsForUser(email: string): Promise<Movie[]> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { 
      watchlist: true // Include watchlist for the user
    }
  })

  const watchlistMovies = user?.watchlist || []; // Get the user's watchlist

  if (watchlistMovies.length === 0) {
    // Fetch random popular movies if no watchlist
    return fetchRandomPopularMovies();
  }

  const genreIds = watchlistMovies.flatMap((movie: any) => movie.genre_ids ? movie.genre_ids.split(',').map((id: string) => parseInt(id, 10)) : []); // Extract and convert genre IDs from watchlist
  const uniqueGenreIds = [...new Set(genreIds)]; // Get unique genre IDs

  return fetchRecommendationsBasedOnGenres(uniqueGenreIds); // Fetch recommendations based on unique genres
}

async function fetchRecommendationsBasedOnGenres(genres: number[]): Promise<Movie[]> {
  if (genres.length === 0) {
    return []; // Return an empty array if no genres are provided
  }

  const genreIds = genres.join(','); // Convert array to a comma-separated string
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreIds}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch recommendations');
  }

  const data = await response.json();
  
  // Map the results to match the Movie type
  return data.results.map((item: any) => ({
    id: item.id.toString(),
    title: item.title,
    overview: item.overview,
    posterPath: item.poster_path,
    releaseDate: new Date(item.release_date),
    rating: item.vote_average,
    duration: item.runtime || 0, // Default to 0 if runtime is not available
    language: item.original_language,
    budget: item.budget || null,
    revenue: item.revenue || null,
    genre_ids: item.genre_ids || [], // Ensure genre_ids is present
  }));
}

async function fetchRandomPopularMovies(): Promise<Movie[]> {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch random popular movies');
  }

  const data = await response.json();
  return data.results.slice(0, 5); // Limit to 5 random movies
}
