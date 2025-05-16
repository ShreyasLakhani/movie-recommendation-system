import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import MovieGrid from './components/MovieGrid'
import { getPopularMovies, Movie } from './services/movies'
import { getRecommendationsForUser } from './services/recommendations'

export default async function Home() {
  const session = await getServerSession(authOptions)
  const movies = await getPopularMovies()

  let recommended: Movie[] = []
  if (session?.user?.email) {
    recommended = await getRecommendationsForUser(session.user.email)
  }

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
        <MovieGrid movies={movies} />
      </section>

      {session && (
        <>
          <section>
            <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
            <MovieGrid movies={recommended} />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Continue Watching</h2>
            <MovieGrid movies={movies.slice(10, 15)} />
          </section>
        </>
      )}
    </div>
  )
}
