// app/api/search/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const year = searchParams.get('year');
    const genre = searchParams.get('genre');
    const rating = searchParams.get('rating');

    if (!query) {
      return new NextResponse('Missing search query', { status: 400 });
    }

    // Construct TMDB API URL with filters
    let url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`;
    
    if (year) {
      url += `&year=${year}`;
    }
    
    if (genre) {
      url += `&with_genres=${genre}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('TMDB API request failed');
    }

    let movies = await response.json();

    // Filter by rating if specified (TMDB doesn't support this in query params)
    if (rating) {
      const minRating = parseFloat(rating);
      movies.results = movies.results.filter(
        (movie: any) => movie.vote_average >= minRating
      );
    }

    // Add personalized recommendations if available
    const userPreferences = await getUserPreferences(session.user.email);
    if (userPreferences) {
      movies.results = rankMoviesByPreference(movies.results, userPreferences);
    }

    return NextResponse.json(movies.results);
  } catch (error) {
    console.error('[SEARCH_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Helper function to get user preferences
async function getUserPreferences(userEmail: string) {
  try {
    // Use email as identifier instead of TMDB account ID
    const response = await fetch(`${TMDB_BASE_URL}/account/preferences?api_key=${TMDB_API_KEY}&session_id=${userEmail}`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Failed to fetch user preferences:', error);
    return null;
  }
}

// Helper function to rank movies based on user preferences
function rankMoviesByPreference(movies: any[], preferences: any) {
  return movies.sort((a, b) => {
    const aScore = calculatePreferenceScore(a, preferences);
    const bScore = calculatePreferenceScore(b, preferences);
    return bScore - aScore;
  });
}

function calculatePreferenceScore(movie: any, preferences: any) {
  let score = 0;
  
  // Base score from rating
  score += movie.vote_average;

  // Bonus for matching genres
  if (preferences.favorite_genres) {
    score += movie.genre_ids.filter((id: number) => 
      preferences.favorite_genres.includes(id)
    ).length * 2;
  }

  return score;
}
