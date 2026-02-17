/**
 * Format price in Pakistani Rupees with comma separators
 * @param price - The price to format
 * @returns Formatted price string (e.g., "Rs. 2,600")
 */
export const formatPrice = (price: number): string => {
  return `Rs. ${price.toLocaleString('en-PK')}`;
};
