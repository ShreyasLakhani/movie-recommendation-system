import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';
import { sendEmail } from '@/app/lib/email';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        preferences: true
      }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Return user preferences or default values if not set
    return NextResponse.json({
      favoriteGenres: user.preferences?.favoriteGenres || [],
      emailNotifications: user.preferences?.emailNotifications ?? true,
      darkMode: user.preferences?.darkMode ?? true,
      language: user.preferences?.language || 'en'
    });
  } catch (error) {
    console.error('[SETTINGS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { favoriteGenres, emailNotifications, darkMode, language } = body;

    // Update or create user preferences
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        preferences: {
          upsert: {
            create: {
              favoriteGenres,
              emailNotifications,
              darkMode,
              language
            },
            update: {
              favoriteGenres,
              emailNotifications,
              darkMode,
              language
            }
          }
        }
      },
      include: {
        preferences: true
      }
    });

    // If the user opted in, send a confirmation email
    if (emailNotifications) {
      sendEmail(
        session.user.email,
        "Your preferences have been updated",
        "Your notification and display preferences at Tasteful Picks have been saved."
      ).catch(console.error);
    }

    return NextResponse.json(user.preferences);
  } catch (error) {
    console.error('[SETTINGS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 