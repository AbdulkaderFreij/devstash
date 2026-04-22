import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Testing database connection...\n')

  // System item types
  const itemTypes = await prisma.itemType.findMany({ where: { isSystem: true } })
  console.log(`System item types (${itemTypes.length}):`)
  itemTypes.forEach((t) => console.log(`  - ${t.name} | icon: ${t.icon} | color: ${t.color}`))

  // Demo user
  const user = await prisma.user.findUnique({
    where: { email: 'demo@devstash.io' },
    select: { id: true, name: true, email: true, isPro: true, emailVerified: true, password: true },
  })
  console.log('\nDemo user:')
  if (user) {
    console.log(`  name:          ${user.name}`)
    console.log(`  email:         ${user.email}`)
    console.log(`  isPro:         ${user.isPro}`)
    console.log(`  emailVerified: ${user.emailVerified}`)
    console.log(`  password hash: ${user.password ? '✓ present' : '✗ missing'}`)
  } else {
    console.log('  ✗ Demo user not found')
  }

  // Collections with item counts
  const collections = await prisma.collection.findMany({
    where: { user: { email: 'demo@devstash.io' } },
    include: {
      items: {
        include: {
          item: { include: { itemType: true } },
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  console.log(`\nCollections (${collections.length}):`)
  for (const col of collections) {
    console.log(`\n  📁 ${col.name}`)
    console.log(`     ${col.description}`)
    console.log(`     Items (${col.items.length}):`)
    for (const { item } of col.items) {
      console.log(`       [${item.itemType.name}] ${item.title}`)
    }
  }

  // Totals
  const [totalItems, totalCollections] = await Promise.all([
    prisma.item.count({ where: { user: { email: 'demo@devstash.io' } } }),
    prisma.collection.count({ where: { user: { email: 'demo@devstash.io' } } }),
  ])

  console.log('\n── Totals ──────────────────────────────')
  console.log(`  Items:       ${totalItems}`)
  console.log(`  Collections: ${totalCollections}`)
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
