import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const movies = await prisma.movie.findMany()
  return NextResponse.json(movies)
}

export async function POST(request: Request) {
  const data = await request.json()
  const movie = await prisma.movie.create({ data })
  return NextResponse.json(movie)
}
