import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'TMDB API key not set' }, { status: 500 })
  }

  // Always fetch the real detail from TMDB
  const tmdbRes = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
  )
  if (!tmdbRes.ok) {
    const text = await tmdbRes.text()
    console.error('TMDB error:', tmdbRes.status, text)
    return NextResponse.json({ error: 'Not found' }, { status: tmdbRes.status })
  }
  const tmdb = await tmdbRes.json()

  // Upsert into your DB with all the fields
  const m = await prisma.movie.upsert({
    where: { id },
    create: {
      id: tmdb.id.toString(),
      title: tmdb.title,
      overview: tmdb.overview,
      poster_path: tmdb.poster_path,
      release_date: new Date(tmdb.release_date),
      rating: tmdb.vote_average,
      duration: tmdb.runtime ?? 0,
      language: tmdb.original_language,
      budget: tmdb.budget,
      revenue: tmdb.revenue,
    },
    update: {
      overview: tmdb.overview,
      poster_path: tmdb.poster_path,
      release_date: new Date(tmdb.release_date),
      rating: tmdb.vote_average,
      duration: tmdb.runtime ?? 0,
      budget: tmdb.budget,
      revenue: tmdb.revenue,
    },
  })

  // figure out if the logged‐in user already has this in their watchlist
  const session = await getServerSession(authOptions)
  const userEmail = session?.user?.email
  let inWatchlist = false
  if (userEmail) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { watchlist: true },
    })
    inWatchlist = user?.watchlist.some(w => w.id === id) ?? false
  }

  // Return it to the client
  return NextResponse.json({
    id: m.id,
    title: m.title,
    overview: m.overview,
    poster_path: m.poster_path,
    backdrop_path: tmdb.backdrop_path, // if you want it
    release_date: m.release_date ? m.release_date.toISOString().slice(0, 10) : 'N/A',
    vote_average: m.rating,
    runtime: m.duration,
    budget: m.budget ?? 0,
    revenue: m.revenue ?? 0,
    genres: tmdb.genres,             // or map your own Genre table
    tagline: tmdb.tagline,
    inWatchlist,
  })
}
