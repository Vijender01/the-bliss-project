import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAPI() {
  console.log('🧪 Testing menu items in database...\n');

  try {
    const items = await prisma.menuItem.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    console.log(`✓ Found ${items.length} menu items:\n`);
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.image} ${item.name}`);
      console.log(`   Price: ₹${item.price}`);
      console.log(`   Desc: ${item.description}\n`);
    });

    console.log('✅ Database seeding successful!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testAPI();
