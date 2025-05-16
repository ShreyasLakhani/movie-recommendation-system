import prisma from '@/app/lib/prisma'
import { Movie } from './movies'

export async function getRecommendationsForUser(email: string): Promise<Movie[]> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { 
      likes: {
        include: { genres: true } // Include genres for liked movies
      }
    }
  })

  // Convert genre IDs to numbers
  const likedGenres = user?.likes.flatMap(movie => movie.genres.map(genre => Number(genre.id))) || []

  if (likedGenres.length === 0) {
    // Fetch random popular movies if no liked genres
    return fetchRandomPopularMovies()
  }

  // Fetch recommendations based on liked genres
  const recommendations = await fetchRecommendationsBasedOnGenres(likedGenres)
  return recommendations.slice(0, 5) // Limit to 5 recommendations
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
  return data.results; // Return the array of movies
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
