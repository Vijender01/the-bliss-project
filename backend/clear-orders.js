import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteOrders() {
    try {
        console.log('🗑️ Deleting all orders and order items...');
        
        // OrderItem will be deleted automatically if cascade onDelete is set, 
        // but explicit deletion is safer if unsure of DB constraints
        const deleteItems = await prisma.orderItem.deleteMany({});
        console.log(`✅ Deleted ${deleteItems.count} order items.`);

        const deleteOrders = await prisma.order.deleteMany({});
        console.log(`✅ Deleted ${deleteOrders.count} orders.`);

        console.log('✨ All orders have been cleared.');
    } catch (error) {
        console.error('❌ Error deleting orders:', error);
    } finally {
        await prisma.$disconnect();
    }
}

deleteOrders();
