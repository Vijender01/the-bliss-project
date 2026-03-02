import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = "8433242282:AAGblrtNYPdPqYl_e7HMTyftHZLU9FYP_W4";

async function getChatId() {
    console.log('🔍 Checking for messages to your bot...');
    try {
        const response = await axios.get(`https://api.telegram.org/bot${TOKEN}/getUpdates`);
        const updates = response.data.result;

        if (updates.length === 0) {
            console.log('❌ No messages found yet.');
            console.log('👉 Please open https://t.me/FoodBliss_bot and send a message like "Hello" to it.');
            console.log('Then run this script again.');
        } else {
            const lastUpdate = updates[updates.length - 1];
            const chatId = lastUpdate.message?.chat.id;
            const firstName = lastUpdate.message?.chat.first_name;

            if (chatId) {
                console.log(`✅ Found Chat ID: ${chatId} (${firstName})`);
                console.log(`🚀 Update your .env with: TELEGRAM_CHAT_ID="${chatId}"`);
            } else {
                console.log('❓ Found updates but no chat ID in the last message.');
            }
        }
    } catch (error) {
        console.error('❌ Error fetching updates:', error.message);
    }
}

getChatId();
