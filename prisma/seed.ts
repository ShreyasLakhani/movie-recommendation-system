import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create test user with preferences
  const hashedPassword = await hash('test123', 10)
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
          darkMode: true,
          language: 'en'
        }
      }
    }
  })

  console.log('Database seeded!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
