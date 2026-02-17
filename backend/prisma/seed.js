import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

const testUsers = [
  {
    name: "Admin User",
    email: "admin@foodbliss.com",
    password: "Admin@123",
    role: "ADMIN"
  },
  {
    name: "Kitchen Owner",
    email: "kitchen@foodbliss.com",
    password: "Kitchen@123",
    role: "KITCHEN_OWNER"
  },
  {
    name: "John Doe",
    email: "customer@foodbliss.com",
    password: "Customer@123",
    role: "CUSTOMER"
  }
];

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

  // Clear existing data (respecting foreign keys)
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.menuItem.deleteMany({});
  console.log('✓ Cleared existing data');

  // Create test users
  console.log('\n📝 Creating test users...');
  for (const user of testUsers) {
    const hashedPassword = await bcryptjs.hash(user.password, 10);
    const created = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash: hashedPassword,
        role: user.role
      }
    });
    console.log(`✓ Created ${user.role}: ${user.email} (password: ${user.password})`);
  }

  // Create menu items
  console.log('\n🍽️  Creating menu items...');
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
