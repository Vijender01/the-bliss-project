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

const mainKitchenName = "Food Bliss";

const menuItems = [
  {
    name: "Paneer Parantha",
    price: 80,
    image: "🧀",
    category: "BREAKFAST",
    description: "Soft paratha stuffed with cottage cheese and spices"
  },
  {
    name: "Aalu Parantha",
    price: 60,
    image: "🥔",
    category: "BREAKFAST",
    description: "Crispy paratha filled with spiced potatoes"
  },
  {
    name: "Poshtik Poha",
    price: 70,
    image: "🌾",
    category: "BREAKFAST",
    description: "Nutritious flattened rice with vegetables and peanuts"
  },
  {
    name: "Thali Combo",
    price: 150,
    image: "🍛",
    category: "LUNCH",
    description: "Complete meal with dal, curry, rice, and bread"
  },
  {
    name: "Chole Bhature",
    price: 120,
    image: "🍳",
    category: "LUNCH",
    description: "Fluffy fried bread served with spiced chickpeas"
  },
  {
    name: "Rajma Rice",
    price: 85,
    image: "🍚",
    category: "LUNCH",
    description: "Rice with kidney beans curry and onions"
  },
  {
    name: "Idli Sambar",
    price: 70,
    image: "🍛",
    category: "BREAKFAST",
    description: "Steamed rice cakes served with vegetable curry"
  },
  {
    name: "Dosa with Chutney",
    price: 90,
    image: "🥙",
    category: "BREAKFAST",
    description: "Crispy rice and lentil crepe with coconut chutney"
  }
];

async function main() {
  console.log('🌱 Starting database seed (Idempotent)...');

  // 1. Create/Ensure primary kitchen exists
  console.log(`\n🏠 Ensuring kitchen "${mainKitchenName}" exists...`);
  let kitchen = await prisma.kitchen.findFirst({
    where: { name: mainKitchenName }
  });

  if (!kitchen) {
    kitchen = await prisma.kitchen.create({
      data: { name: mainKitchenName }
    });
    console.log(`✓ Created kitchen: ${kitchen.name} (ID: ${kitchen.id})`);
  } else {
    console.log(`ℹ Kitchen "${mainKitchenName}" already exists.`);
  }

  // 2. Create/Ensure test users exist
  console.log('\n📝 Ensuring test users exist...');
  for (const user of testUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!existingUser) {
      const hashedPassword = await bcryptjs.hash(user.password, 10);
      const data = {
        name: user.name,
        email: user.email,
        passwordHash: hashedPassword,
        role: user.role,
      };

      // Assign kitchen owner to our main kitchen
      if (user.role === 'KITCHEN_OWNER') {
        data.kitchenId = kitchen.id;
      }

      const created = await prisma.user.create({ data });
      console.log(`✓ Created ${user.role}: ${user.email}`);
    } else {
      console.log(`ℹ User ${user.email} already exists.`);
      
      // Update role/kitchen if needed
      if (user.role === 'KITCHEN_OWNER' && !existingUser.kitchenId) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { kitchenId: kitchen.id }
        });
        console.log(`  → Assigned existing kitchen owner to "${mainKitchenName}"`);
      }
    }
  }

  // 3. Create/Ensure menu items exist
  console.log('\n🍽️  Ensuring menu items exist...');
  for (const item of menuItems) {
    const existingItem = await prisma.menuItem.findFirst({
      where: { 
        name: item.name,
        kitchenId: kitchen.id
      }
    });

    if (!existingItem) {
      const created = await prisma.menuItem.create({
        data: {
          ...item,
          isActive: true,
          kitchenId: kitchen.id,
        },
      });
      console.log(`✓ Created menu item: ${created.name} (₹${created.price})`);
    } else {
      console.log(`ℹ Menu item "${item.name}" already exists.`);
    }
  }

  console.log('\n✅ Seeding complete! Data is safe and won\'t be duplicated.');
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
