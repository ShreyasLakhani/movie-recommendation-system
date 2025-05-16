import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create test user with preferences
  const hashedPassword = await bcrypt.hash('test123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
      update: {},
      create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      preferences: {
        create: {
          favoriteGenres: ['28', '12', '16'], // Action, Adventure, Animation
          emailNotifications: true,
        language: 'en',
          region: 'US',            // will override the default if you want
          contentMaturity: 'all',  // will override the default if you want
        }
      }
    }
  })

  console.log('✅ Database seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
