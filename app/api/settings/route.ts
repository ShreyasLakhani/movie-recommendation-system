import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import prisma from '@/app/lib/prisma';
import { sendEmail } from '@/app/lib/email';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        preferences: true,
      },
    });

    if (!user?.preferences) {
      // Return default preferences if none exist
      return NextResponse.json({
        favoriteGenres: [],
        emailNotifications: true,
        language: 'en',
        region: 'US',
        contentMaturity: 'all'
      });
    }

    return NextResponse.json(user.preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const preferences = await request.json();
    
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedPreferences = await prisma.userPreferences.upsert({
      where: {
        userId: user.id,
      },
      update: {
        favoriteGenres: preferences.favoriteGenres || [],
        emailNotifications: preferences.emailNotifications,
        language: preferences.language,
        region: preferences.region || 'US',
        contentMaturity: preferences.contentMaturity || 'all',
      },
      create: {
        userId: user.id,
        favoriteGenres: preferences.favoriteGenres || [],
        emailNotifications: preferences.emailNotifications,
        language: preferences.language,
        region: preferences.region || 'US',
        contentMaturity: preferences.contentMaturity || 'all',
      },
    });

    // Handle email notifications
    if (preferences.emailNotifications) {
      try {
        await sendEmail(
          session.user.email,
          "Your preferences have been updated",
          "Your notification and display preferences at Tasteful Picks have been saved."
        );
      } catch (emailError: any) {
        // Return success with warning about email
        return NextResponse.json({
          ...updatedPreferences,
          warning: emailError.message || 'Failed to send email notification'
        });
      }
    }

    return NextResponse.json(updatedPreferences);
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 