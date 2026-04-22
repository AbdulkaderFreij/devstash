import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Testing database connection...')

  const itemTypes = await prisma.itemType.findMany()
  console.log(`Found ${itemTypes.length} system item types:`)
  itemTypes.forEach((t) => console.log(`  - ${t.name} (${t.color})`))

  const userCount = await prisma.user.count()
  console.log(`Users: ${userCount}`)

  const itemCount = await prisma.item.count()
  console.log(`Items: ${itemCount}`)

  const collectionCount = await prisma.collection.count()
  console.log(`Collections: ${collectionCount}`)

  console.log('\nDatabase connection OK ✓')
}

main()
  .catch((e) => {
    console.error('Database connection failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
