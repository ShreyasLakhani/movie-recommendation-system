// app/api/search/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) return NextResponse.json({ results: [] })

  const TMDB_API_KEY = process.env.TMDB_API_KEY
  if (!TMDB_API_KEY) {
    console.error("Missing TMDB API Key in .env.local")
    return NextResponse.json({ results: [] })
  }

  const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`

  try {
    const res = await fetch(tmdbUrl)
    const data = await res.json()

    return NextResponse.json({
      results: Array.isArray(data.results) ? data.results : []
    })
  } catch (err) {
    return NextResponse.json({ results: [] })
  }
}
