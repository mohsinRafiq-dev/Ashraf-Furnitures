import { MessageCircle } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";
import { sendProductInquiry } from "../utils/whatsapp";

interface PriceOrInquiryProps {
  productName: string;
  price?: number | null;
  hidePrice?: boolean;
  /** Visual variant — "card" for compact tiles, "detail" for the product page. */
  variant?: "card" | "detail";
  className?: string;
}

/**
 * Renders the product price OR a "Contact for Price" WhatsApp CTA when the
 * admin has flagged the product as `hidePrice`. Centralises this branch so
 * grids, cards, detail pages, search results and wishlist stay consistent.
 */
export function PriceOrInquiry({
  productName,
  price,
  hidePrice,
  variant = "card",
  className = "",
}: PriceOrInquiryProps) {
  const shouldHide = hidePrice || !price || price <= 0;

  if (!shouldHide && typeof price === "number") {
    return (
      <span
        className={`font-bold text-amber-600 ${
          variant === "detail" ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
        } ${className}`}
      >
        {formatPrice(price)}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        sendProductInquiry(productName, price ?? null, { showPrice: false });
      }}
      className={`inline-flex items-center gap-2 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all hover:scale-[1.02] active:scale-95 shadow-sm hover:shadow ${
        variant === "detail"
          ? "px-5 py-3 text-base"
          : "px-3 py-2 text-xs sm:text-sm"
      } ${className}`}
      aria-label={`Contact us on WhatsApp for the price of ${productName}`}
    >
      <MessageCircle className={variant === "detail" ? "w-5 h-5" : "w-4 h-4"} />
      <span>{variant === "detail" ? "Contact for Price" : "Ask Price"}</span>
    </button>
  );
}
