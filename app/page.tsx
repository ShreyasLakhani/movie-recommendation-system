import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import HomePageClient from './components/HomePageClient'
import { getPopularMovies, Movie } from './services/movies'
import { getRecommendationsForUser } from './services/recommendations'

export default async function Home() {
  const session = await getServerSession(authOptions)
  const movies = await getPopularMovies()

  let initialRecommendedMovies: Movie[] = []
  if (session?.user?.email) {
    initialRecommendedMovies = await getRecommendationsForUser(session.user.email)
  }

  return <HomePageClient initialPopularMovies={movies} initialRecommendedMovies={initialRecommendedMovies} />;
}
