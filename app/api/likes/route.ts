import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { movieId } = await request.json();
  const movieIdString = String(movieId); // Ensure movieId is a string

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      likes: {
        connect: { id: movieIdString }, // Use the string version of the ID
      },
    },
  });

  return NextResponse.json({ message: 'Movie liked successfully' });
}
