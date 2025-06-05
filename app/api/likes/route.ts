import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ likedIds: [] });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { likes: true },
  });
  const likedIds = user?.likes.map(movie => movie.id) || [];
  return NextResponse.json({ likedIds });
} 