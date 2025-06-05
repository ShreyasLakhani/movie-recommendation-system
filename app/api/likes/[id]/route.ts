import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';

// Helper to fetch movie details from TMDB and map to Prisma schema
async function fetchMovieFromTMDB(id: string) {
  const apiKey = process.env.TMDB_API_KEY;
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`);
  if (!res.ok) return null;
  const data = await res.json();
  return {
    id: id,
    title: data.title,
    overview: data.overview || '',
    poster_path: data.poster_path || '',
    backdrop_path: data.backdrop_path || '',
    release_date: data.release_date ? new Date(data.release_date) : null,
    vote_average: data.vote_average || null,
    genre_ids: Array.isArray(data.genres) ? data.genres.map((g: any) => g.id) : [],
    rating: null,
    duration: data.runtime || null,
    language: data.original_language || null,
    budget: data.budget || null,
    revenue: data.revenue || null,
  };
}

// GET: Check if a movie is liked by the user
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ liked: false });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { likes: true },
  });
  const liked = user?.likes.some(movie => movie.id === id) || false;
  return NextResponse.json({ liked });
}

// POST: Like a movie
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Ensure the movie exists in the database
  let movie = await prisma.movie.findUnique({ where: { id } });
  if (!movie) {
    const tmdbMovie = await fetchMovieFromTMDB(id);
    if (!tmdbMovie) {
      return NextResponse.json({ error: 'Movie not found in TMDB.' }, { status: 404 });
    }
    movie = await prisma.movie.create({ data: tmdbMovie });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { likes: { connect: { id } } },
  });
  return NextResponse.json({ message: 'Movie liked' });
}

// DELETE: Unlike a movie
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { likes: { disconnect: { id } } },
  });
  return NextResponse.json({ message: 'Movie unliked' });
} 