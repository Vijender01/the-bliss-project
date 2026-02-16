import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const menuItems = [
  {
    name: "Paneer Parantha",
    price: 80,
    image: "🧀",
    description: "Soft paratha stuffed with cottage cheese and spices"
  },
  {
    name: "Aalu Parantha",
    price: 60,
    image: "🥔",
    description: "Crispy paratha filled with spiced potatoes"
  },
  {
    name: "Poshtik Poha",
    price: 70,
    image: "🌾",
    description: "Nutritious flattened rice with vegetables and peanuts"
  },
  {
    name: "Thali Combo",
    price: 150,
    image: "🍛",
    description: "Complete meal with dal, curry, rice, and bread"
  },
  {
    name: "Chole Bhature",
    price: 120,
    image: "🍳",
    description: "Fluffy fried bread served with spiced chickpeas"
  },
  {
    name: "Idli Sambar",
    price: 70,
    image: "🥘",
    description: "Steamed rice cakes served with vegetable curry"
  },
  {
    name: "Dosa with Chutney",
    price: 90,
    image: "🥙",
    description: "Crispy rice and lentil crepe with coconut chutney"
  },
  {
    name: "Rajma Rice",
    price: 85,
    image: "🍚",
    description: "Rice with kidney beans curry and onions"
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing items (optional, comment out to preserve)
  await prisma.menuItem.deleteMany({});
  console.log('✓ Cleared existing menu items');

  // Create menu items
  for (const item of menuItems) {
    const created = await prisma.menuItem.create({
      data: {
        ...item,
        isActive: true
      }
    });
    console.log(`✓ Created: ${created.name} (₹${created.price})`);
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
