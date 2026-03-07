import 'dotenv/config'
import { prisma } from './database.js'
import bcrypt from 'bcryptjs'

async function seed() {
  const password_hash = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@expensemanager.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@expensemanager.com',
      role: 'ADMIN',
      password_hash,
    },
  })

  console.log('Seed executed with success')
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
