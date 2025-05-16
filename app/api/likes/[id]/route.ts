import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';

// GET handler to check if a movie is liked
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { likes: true }
  });

  const liked = user?.likes.some(movie => movie.id === params.id) || false;

  return NextResponse.json({ liked });
}

// DELETE handler to remove a movie from likes
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params; // Await params

  // Get the session to identify the user
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the user based on their email
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const userId = user?.id; // Get the user ID

  if (!userId) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      likes: {
        disconnect: { id }, // Disconnect the like
      },
    },
  });

  return NextResponse.json({ message: 'Movie removed from likes' });
}

// POST handler to add a movie to likes
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params; // Await params

  // Get the session to identify the user
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the user based on their email
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const userId = user?.id; // Get the user ID

  if (!userId) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      likes: {
        connect: { id }, // Connect the like
      },
    },
  });

  return NextResponse.json({ message: 'Movie added to likes' });
}
