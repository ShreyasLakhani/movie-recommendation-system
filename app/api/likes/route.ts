import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import prisma from '@/app/lib/prisma';
import { getMovieById } from '@/app/services/movies';

interface Genre {
  id: number;
  name: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ likedMovies: [] });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { likes: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const likedMovieIds = user.likes.map(movie => movie.id);
    const likedMoviesPromises = likedMovieIds.map(async (movieId) => {
      const movie = await getMovieById(movieId);
      return movie;
    });

    const likedMovies = (await Promise.all(likedMoviesPromises)).filter(Boolean); // Filter out nulls if any movie not found
    return NextResponse.json({ likedMovies });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { movieId } = await request.json();
    if (!movieId) {
      return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { likes: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isAlreadyLiked = user.likes.some(movie => movie.id === movieId.toString());
    if (isAlreadyLiked) {
      return NextResponse.json({ success: true });
    }

    const apiKey = process.env.TMDB_API_KEY;
    const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
    if (!movieRes.ok) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }
    const movieData = await movieRes.json();

    const movie = await prisma.movie.upsert({
      where: { id: movieId.toString() },
      update: {},
      create: {
        id: movieId.toString(),
        title: movieData.title,
        overview: movieData.overview,
        poster_path: movieData.poster_path,
        backdrop_path: movieData.backdrop_path,
        release_date: movieData.release_date ? new Date(movieData.release_date) : null,
        vote_average: movieData.vote_average,
        genre_ids: movieData.genres.map((g: Genre) => g.id),
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        likes: {
          connect: { id: movie.id }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error liking movie:', error);
    return NextResponse.json({ error: 'Failed to like movie' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { movieId } = await request.json();
    if (!movieId) {
      return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { likes: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isLiked = user.likes.some(movie => movie.id === movieId.toString());
    if (!isLiked) {
      return NextResponse.json({ success: true });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        likes: {
          disconnect: { id: movieId.toString() }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unliking movie:', error);
    return NextResponse.json({ error: 'Failed to unlike movie' }, { status: 500 });
  }
} 