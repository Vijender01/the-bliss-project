import { sendTelegramAlert } from './src/services/telegram.js';
import dotenv from 'dotenv';
dotenv.config();

async function testAlert() {
    console.log('Testing Telegram Alert...');
    console.log('Token:', process.env.TELEGRAM_BOT_TOKEN ? 'EXISTS' : 'MISSING');
    console.log('Chat ID:', process.env.TELEGRAM_CHAT_ID ? 'EXISTS' : 'MISSING');
    
    await sendTelegramAlert('🚀 <b>Test Alert from Food Bliss!</b>\nYour Telegram integration is now active.');
}

testAlert();
