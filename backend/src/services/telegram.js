import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * Sends a message to the configured Telegram chat
 * @param {string} message 
 */
export async function sendTelegramAlert(message) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('⚠️ Telegram credentials missing in .env');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    });
    console.log('📡 Telegram alert sent');
  } catch (error) {
    console.error('❌ Failed to send Telegram alert:', error.response?.data || error.message);
  }
}
