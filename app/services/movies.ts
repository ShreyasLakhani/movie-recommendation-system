const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export interface Movie {
  id: string
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  genre_ids: number[]
}

export async function getPopularMovies(): Promise<Movie[]> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY is not defined')
  }

  const res = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch popular movies')
  }

  const data = await res.json()
  return data.results
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY is not defined')
  }

  const res = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`,
    { next: { revalidate: 60 } }
  )

  if (!res.ok) {
    throw new Error('Failed to search movies')
  }

  const data = await res.json()
  return data.results
}

export async function getMovieDetails(id: string): Promise<Movie | null> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY is not defined')
  }

  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) {
    return null
  }

  const data = await res.json()
  return {
    id: data.id.toString(),
    title: data.title,
    overview: data.overview,
    poster_path: data.poster_path,
    backdrop_path: data.backdrop_path,
    release_date: data.release_date,
    vote_average: data.vote_average,
    genre_ids: data.genres ? data.genres.map((g: any) => g.id) : [],
  }
} 