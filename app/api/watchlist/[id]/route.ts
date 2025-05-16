import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/app/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // await the dynamic params to get the movieId
  const { id: movieId } = await params

  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { watchlist: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove movie from watchlist using the many-to-many relationship
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        watchlist: {
          disconnect: { id: movieId }
        }
      },
      include: { watchlist: true }
    })

    return NextResponse.json(updatedUser.watchlist)
  } catch (error) {
    console.error('Error removing from watchlist:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
