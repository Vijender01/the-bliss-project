import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const ORDERS_TOKEN = process.env.TELEGRAM_ORDERS_TOKEN;
const SYSTEM_TOKEN = process.env.TELEGRAM_SYSTEM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * Sends a message to the configured Telegram chat
 * @param {string} message 
 * @param {string} type - 'ORDERS' (default) or 'SYSTEM'
 */
export async function sendTelegramAlert(message, type = 'ORDERS') {
  const token = type === 'SYSTEM' ? SYSTEM_TOKEN : ORDERS_TOKEN;

  if (!token || !CHAT_ID) {
    console.warn(`⚠️ Telegram ${type} credentials missing in .env`);
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    });
    console.log(`📡 Telegram ${type} alert sent`);
  } catch (error) {
    console.error(`❌ Failed to send Telegram ${type} alert:`, error.response?.data || error.message);
  }
}

/**
 * Formats and sends a new order notification
 * @param {object} order - Order with items and user
 */
export async function formatAndSendOrderAlert(order) {
  try {
    const itemsText = order.items
      .map(i => `• ${i.menuItem.name} x${i.quantity}`)
      .join('\n');

    const dateStr = new Date(order.deliveryDate).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    const message = `🛍 <b>NEW ORDER #${order.id}</b>\n\n` +
      `👤 <b>Customer:</b> ${order.user.name}\n` +
      `📅 <b>Delivery:</b> ${dateStr}\n\n` +
      `📦 <b>Items:</b>\n${itemsText}\n\n` +
      `💰 <b>Total: ₹${order.totalAmount.toFixed(0)}</b>`;

    await sendTelegramAlert(message);
  } catch (err) {
    console.error('Telegram Order Alert Error:', err.message);
  }
}

/**
 * Sends a consolidated summary of orders for a specific date
 * @param {PrismaClient} prisma 
 * @param {Date} deliveryDate 
 */
export async function formatAndSendSummaryAlert(prisma, deliveryDate) {
  try {
    const orders = await prisma.order.findMany({
      where: { 
        deliveryDate,
        status: { not: 'CANCELLED' } 
      },
      include: { items: { include: { menuItem: true } } }
    });

    if (orders.length === 0) return;

    const summary = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const name = item.menuItem.name;
        summary[name] = (summary[name] || 0) + item.quantity;
      });
    });

    const dateStr = new Date(deliveryDate).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short'
    });

    const itemsText = Object.entries(summary)
      .map(([name, qty]) => `◽️ ${name}: <b>${qty}</b>`)
      .sort()
      .join('\n');

    const message = `📊 <b>UPDATED SUMMARY (${dateStr})</b>\n\n` +
      `${itemsText}\n\n` +
      `✅ Total Active Orders: ${orders.length}`;

    await sendTelegramAlert(message);
  } catch (err) {
    console.error('Telegram Summary Alert Error:', err.message);
  }
}
