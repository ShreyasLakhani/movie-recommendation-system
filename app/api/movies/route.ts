import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config'
import { getServerSession } from 'next-auth'
import prisma from '@/app/lib/prisma'

const prismaClient = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { watchlist: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user.watchlist.map(m => ({
      id: m.id,
      title: m.title,
      overview: m.overview,
      poster_path: m.poster_path,
      release_date: m.release_date?.toISOString().split('T')[0] || null,
      vote_average: m.vote_average,
      genre_ids: m.genre_ids,
    })))
  } catch (error) {
    console.error('Error fetching movies:', error)
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const data = await request.json()
  const movie = await prismaClient.movie.create({ data })
  return NextResponse.json(movie)
}
