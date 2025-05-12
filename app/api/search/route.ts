// app/api/search/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { searchMovies } from '@/app/services/movies'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return new NextResponse('Missing search query', { status: 400 })
    }

    const movies = await searchMovies(query)
    return NextResponse.json(movies)
  } catch (error) {
    console.error('[SEARCH_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
