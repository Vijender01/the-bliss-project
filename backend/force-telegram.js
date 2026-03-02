import axios from 'axios';

const TOKEN = "8433242282:AAGblrtNYPdPqYl_e7HMTyftHZLU9FYP_W4";
const CHAT_ID = "929117181";

async function forceMessage() {
    try {
        const response = await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: "Hello from the script! If you see this, the connection is working."
        });
        console.log('Response:', response.data);
    } catch (e) {
        console.error('Error:', e.response?.data || e.message);
    }
}

forceMessage();
