// TMDB API service for fetching movie data
// This service will handle all requests to The Movie Database API

// Base URL and API endpoints
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

// Type definitions for movie data
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Function to fetch popular movies
export async function getPopularMovies(page: number = 1): Promise<MovieListResponse> {
  const response = await fetch(
    `${TMDB_API_BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch popular movies');
  }
  
  return response.json();
}

// Function to fetch movie details
export async function getMovieDetails(movieId: number): Promise<any> {
  const response = await fetch(
    `${TMDB_API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch movie details for ID: ${movieId}`);
  }
  
  return response.json();
}

// Function to search for movies
export async function searchMovies(query: string, page: number = 1): Promise<MovieListResponse> {
  const response = await fetch(
    `${TMDB_API_BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to search movies');
  }
  
  return response.json();
}

// Function to get movie genres
export async function getGenres(): Promise<any> {
  const response = await fetch(
    `${TMDB_API_BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch genres');
  }
  
  return response.json();
} 