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

const kitchens = [
  { name: "Desi Delights Kitchen" },
  { name: "South Indian Corner" }
];

const menuItemsByKitchen = {
  "Desi Delights Kitchen": [
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
      name: "Rajma Rice",
      price: 85,
      image: "🍚",
      description: "Rice with kidney beans curry and onions"
    }
  ],
  "South Indian Corner": [
    {
      name: "Idli Sambar",
      price: 70,
      image: "�",
      description: "Steamed rice cakes served with vegetable curry"
    },
    {
      name: "Dosa with Chutney",
      price: 90,
      image: "🥙",
      description: "Crispy rice and lentil crepe with coconut chutney"
    }
  ]
};

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (respecting foreign keys)
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.menuItem.deleteMany({});
  // Remove kitchen reference from users before deleting kitchens
  await prisma.user.updateMany({ data: { kitchenId: null } });
  await prisma.user.deleteMany({});
  await prisma.kitchen.deleteMany({});
  console.log('✓ Cleared existing data');

  // Create kitchens
  console.log('\n🏠 Creating kitchens...');
  const createdKitchens = {};
  for (const k of kitchens) {
    const created = await prisma.kitchen.create({ data: { name: k.name } });
    createdKitchens[k.name] = created;
    console.log(`✓ Created kitchen: ${created.name} (ID: ${created.id})`);
  }

  // Create test users
  console.log('\n📝 Creating test users...');
  for (const user of testUsers) {
    const hashedPassword = await bcryptjs.hash(user.password, 10);
    const data = {
      name: user.name,
      email: user.email,
      passwordHash: hashedPassword,
      role: user.role,
    };

    // Assign kitchen owner to first kitchen
    if (user.role === 'KITCHEN_OWNER') {
      data.kitchenId = createdKitchens["Desi Delights Kitchen"].id;
    }

    const created = await prisma.user.create({ data });
    console.log(`✓ Created ${user.role}: ${user.email} (password: ${user.password})${user.role === 'KITCHEN_OWNER' ? ` → Kitchen: Desi Delights Kitchen` : ''}`);
  }

  // Create menu items per kitchen
  console.log('\n🍽️  Creating menu items...');
  for (const [kitchenName, items] of Object.entries(menuItemsByKitchen)) {
    const kitchen = createdKitchens[kitchenName];
    for (const item of items) {
      const created = await prisma.menuItem.create({
        data: {
          ...item,
          isActive: true,
          kitchenId: kitchen.id,
        },
      });
      console.log(`✓ Created: ${created.name} (₹${created.price}) → ${kitchenName}`);
    }
  }

  console.log('\n✅ Seeding complete!');
  console.log('\n📋 Login Credentials:');
  console.log('  Admin:    admin@foodbliss.com / Admin@123');
  console.log('  Kitchen:  kitchen@foodbliss.com / Kitchen@123');
  console.log('  Customer: customer@foodbliss.com / Customer@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
