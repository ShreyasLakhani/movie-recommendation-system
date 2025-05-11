import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let m = await prisma.movie.findUnique({ where: { id } })
  if (!m) {
    // Fetch from TMDB using env API key
    const apiKey = process.env.TMDB_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'TMDB API key not set' }, { status: 500 })
    }
    const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)
    if (!tmdbRes.ok) {
      const errorText = await tmdbRes.text();
      console.error('TMDB error:', tmdbRes.status, errorText);
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const tmdbMovie = await tmdbRes.json()
    // Insert into your DB
    m = await prisma.movie.create({
      data: {
        id: tmdbMovie.id.toString(),
        title: tmdbMovie.title,
        overview: tmdbMovie.overview,
        posterPath: tmdbMovie.poster_path,
        releaseDate: new Date(tmdbMovie.release_date),
        rating: tmdbMovie.vote_average,
        duration: tmdbMovie.runtime,
        language: tmdbMovie.original_language,
      }
    })
  }
  // Return the movie (from DB)
  return NextResponse.json({
    id: m.id,
    title: m.title,
    overview: m.overview,
    poster_path: m.posterPath,
    release_date: m.releaseDate?.toISOString().slice(0, 10) ?? null,
    vote_average: m.rating ?? 0,
    runtime: m.duration ?? 0,
    genres: [], // fill if you add genres
  })
}
