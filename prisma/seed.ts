import { PrismaClient } from '@prisma/client'
import { getPopularMovies, getMovieDetails } from '../app/services/tmdb'

const prisma = new PrismaClient()

async function main() {
  const { results } = await getPopularMovies(1)
  for (const m of results) {
    // fetch full details so we seed runtime, budget, revenue
    const detail = await getMovieDetails(m.id)
    await prisma.movie.upsert({
      where: { id: m.id.toString() },
      update: {},
      create: {
        id: detail.id.toString(),
        title: detail.title || '',
        overview: detail.overview || '',
        posterPath: detail.poster_path || '',
        releaseDate: detail.release_date ? new Date(detail.release_date) : new Date(),
        rating: detail.vote_average || 0,
        language: 'en',
        duration: detail.runtime || 0,
        budget: detail.budget,
        revenue: detail.revenue,
      },
    })
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
