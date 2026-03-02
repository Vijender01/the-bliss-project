import { sendTelegramAlert, formatAndSendOrderAlert } from './src/services/telegram.js';
import dotenv from 'dotenv';
dotenv.config();

async function runTests() {
    console.log('🧪 Starting Dual-Bot Verification...');

    // 1. Test System Bot (@FoodBliss_bot)
    console.log('\n📡 Testing SYSTEM BOT (@FoodBliss_bot)...');
    await sendTelegramAlert('✅ <b>SYSTEM TEST:</b> Your status bot is active!', 'SYSTEM');

    // 2. Test Orders Bot (@FoodBlissOrders_bot)
    console.log('\n🛍️ Testing ORDERS BOT (@FoodBlissOrders_bot)...');
    const mockOrder = {
        id: "TEST-001",
        user: { name: "Test Admin" },
        deliveryDate: new Date(),
        totalAmount: 150,
        items: [
            { menuItem: { name: "Aloo Paratha" }, quantity: 2 },
            { menuItem: { name: "Adrak Chai" }, quantity: 1 }
        ]
    };
    await formatAndSendOrderAlert(mockOrder);

    console.log('\n✨ Tests completed. Check your Telegram apps!');
}

runTests();
