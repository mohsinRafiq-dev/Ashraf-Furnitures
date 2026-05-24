/**
 * WhatsApp Utilities
 * Handles WhatsApp ordering functionality
 */

import { formatPrice } from './formatPrice';

// WhatsApp Business Number (Update this with your actual number)
const WHATSAPP_NUMBER = '923457571471'; // Format: Country code + number (no + or spaces)

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

/**
 * Send product inquiry via WhatsApp.
 *
 * When the product's price is hidden (or omitted), we ask the seller for a
 * quote instead of echoing the amount back.
 */
export const sendProductInquiry = (
  productName: string,
  price?: number | null,
  options: { showPrice?: boolean } = {}
) => {
  const showPrice =
    options.showPrice ?? (typeof price === 'number' && price > 0);

  const message = showPrice && typeof price === 'number'
    ? `Hi, I'm interested in:\n\n📦 *${productName}*\n💰 Price: ${formatPrice(price)}\n\nCan you please provide more details?`
    : `Hi, I'm interested in:\n\n📦 *${productName}*\n\nCan you please share the price and availability?`;

  openWhatsApp(message);
};

/**
 * Send order via WhatsApp with cart items
 */
export const sendWhatsAppOrder = (items: OrderItem[], totalPrice: number) => {
  let message = `*🛒 New Order Request*\n\n`;
  
  items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Price: ${formatPrice(item.price)}\n`;
    message += `   Quantity: ${item.quantity}\n`;
    if (item.variant) {
      message += `   Variant: ${item.variant}\n`;
    }
    message += `   Subtotal: ${formatPrice(item.price * item.quantity)}\n\n`;
  });
  
  message += `━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Total: ${formatPrice(totalPrice)}*\n\n`;
  message += `Please confirm availability and delivery details.`;
  
  openWhatsApp(message);
};

/**
 * Send custom message via WhatsApp
 */
export const sendWhatsAppMessage = (message: string) => {
  openWhatsApp(message);
};

/**
 * Open WhatsApp with pre-filled message
 */
const openWhatsApp = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(url, '_blank');
};

/**
 * Get WhatsApp contact link
 */
export const getWhatsAppLink = () => {
  return `https://wa.me/${WHATSAPP_NUMBER}`;
};

/**
 * Get formatted WhatsApp number for display
 */
export const getFormattedWhatsAppNumber = () => {
  // Format: +92 300 1234567
  return `+${WHATSAPP_NUMBER.slice(0, 2)} ${WHATSAPP_NUMBER.slice(2, 5)} ${WHATSAPP_NUMBER.slice(5)}`;
};
