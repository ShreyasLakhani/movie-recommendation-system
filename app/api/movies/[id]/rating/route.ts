import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config'
import prisma from '@/app/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: movieId } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1) Fetch the full user record to grab its `id`:
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  const userId = dbUser.id

  // fetch the user's existing rating
  const existing = await prisma.rating.findUnique({
    where: { userId_movieId: { userId, movieId } }
  })

  // optionally, compute average:
  const avg = await prisma.rating.aggregate({
    _avg: { rating: true },
    where: { movieId }
  })

  return NextResponse.json({
    myRating: existing?.rating ?? 0,
    averageRating: avg._avg.rating ?? 0
  })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: movieId } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { rating } = await request.json()
  if (typeof rating !== 'number' || rating < 0 || rating > 10) {
    return NextResponse.json({ error: 'Invalid rating' }, { status: 400 })
  }

  // 1) Fetch the full user record to grab its `id`:
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  const userId = dbUser.id

  // upsert the rating
  const record = await prisma.rating.upsert({
    where: { userId_movieId: { userId, movieId } },
    create: { userId, movieId, rating },
    update: { rating }
  })

  return NextResponse.json({ rating: record.rating })
}
