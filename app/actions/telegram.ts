"use server"

import { Order } from "@/lib/types"

const TELEGRAM_BOT_TOKEN = "7258585171:AAHyy14FyB9SvGTWbEWsfLMsNQ9yB6g4gGM"
const TELEGRAM_CHAT_ID = "962225946"

export async function sendTelegramNotification(order: Order) {
    if (!order) return { success: false, error: "No order data" }

    try {
        const itemsList = order.items
            .map(item => `• ${item.product.name} (x${item.quantity}) - ${item.product.price * item.quantity} ETB`)
            .join("\n")

        const date = new Date(order.createdAt).toLocaleDateString()
        const time = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        const message = `
🚨 **NEW ORDER RECEIVED** 🚨

🆔 **Order ID:** #${order.id.slice(0, 8)}
📅 **Date:** ${date}
⏰ **Time:** ${time}

👤 **Customer Details:**
Name: ${order.shippingAddress.fullName}
Phone: ${order.shippingAddress.phone}
Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}

🛒 **Items Ordered:**
${itemsList}

💰 **Total Amount:** ${order.total} ETB

Please check the Admin Panel for more details.
`

        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown",
            }),
        })

        const data = await response.json()

        if (!data.ok) {
            console.error("Telegram API Error:", data)
            return { success: false, error: data.description }
        }

        return { success: true }
    } catch (error) {
        console.error("Failed to send Telegram notification:", error)
        return { success: false, error: "Network error" }
    }
}

export async function sendCancellationNotification(order: Order) {
    if (!order) return { success: false, error: "No order data" }

    try {
        const message = `
⚠️ **ORDER CANCELLED** ⚠️

🆔 **Order ID:** #${order.id.slice(0, 8)}
👤 **Customer:** ${order.shippingAddress.fullName}
💰 **Refund Amount:** ${order.total} ETB

❌ The customer has cancelled this order.
`

        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown",
            }),
        })

        return { success: true }
    } catch (error) {
        console.error("Failed to send cancellation alert:", error)
        return { success: false }
    }
}
