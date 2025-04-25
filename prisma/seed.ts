import { PrismaClient } from '@prisma/client'
import { getPopularMovies } from '../app/services/tmdb'

const prisma = new PrismaClient()

async function main() {
  const { results } = await getPopularMovies(1)
  for (const m of results) {
    await prisma.movie.upsert({
      where: { id: m.id.toString() },
      update: {},
      create: {
        id: m.id.toString(),
        title: m.title,
        overview: m.overview,
        posterPath: m.poster_path,
        releaseDate: new Date(m.release_date),
        rating: m.vote_average,
        language: 'en',
        duration: 0, // or pull runtime if available
      },
    })
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
