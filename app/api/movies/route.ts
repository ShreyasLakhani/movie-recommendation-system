import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const movies = await prisma.movie.findMany()
  const payload = movies.map((m) => ({
    id: Number(m.id),
    title: m.title,
    overview: m.overview,
    poster_path: m.posterPath,
    release_date: m.releaseDate.toISOString().split('T')[0],
    vote_average: m.rating,       // TMDB field name expected by MovieCard
    genre_ids: [],                // or fetch/store genres later
  }))
  return NextResponse.json(payload)
}

export async function POST(request: Request) {
  const data = await request.json()
  const movie = await prisma.movie.create({ data })
  return NextResponse.json(movie)
}
