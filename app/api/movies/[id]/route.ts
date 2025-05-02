import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const m = await prisma.movie.findUnique({ where: { id: params.id } })
  if (!m) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    id: Number(m.id),
    title: m.title,
    overview: m.overview,
    poster_path: m.posterPath,
    release_date: m.releaseDate?.toISOString().slice(0, 10) ?? null,
    vote_average: m.rating ?? 0,
    runtime: m.duration ?? 0,
    genres: [], // fill if you add genres
  })
}
