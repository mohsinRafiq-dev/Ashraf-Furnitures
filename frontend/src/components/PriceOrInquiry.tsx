import { MessageCircle } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";
import { sendProductInquiry } from "../utils/whatsapp";

interface PriceOrInquiryProps {
  productName: string;
  price?: number | null;
  hidePrice?: boolean;
  /** Visual variant — "card" is a quiet label, "detail" is a full button. */
  variant?: "card" | "detail";
  className?: string;
}

/**
 * Decides what to show in the "price slot" on a product card or detail page.
 *
 * - When the price is visible, prints the formatted amount.
 * - When the admin has hidden the price:
 *     • `variant="card"` → quiet "Price on Request" label (no button).
 *       The card's primary CTA below handles the WhatsApp action.
 *     • `variant="detail"` → full WhatsApp "Contact for Price" button
 *       (detail page has room for a prominent CTA at the price slot).
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

  // Card variant: quiet inline label, no button — primary CTA handles WhatsApp.
  if (variant === "card") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-amber-700 ${className}`}
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Price on Request
      </span>
    );
  }

  // Detail variant: full WhatsApp button.
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        sendProductInquiry(productName, price ?? null, { showPrice: false });
      }}
      className={`inline-flex items-center gap-2 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all hover:scale-[1.02] active:scale-95 shadow-sm hover:shadow px-5 py-3 text-base ${className}`}
      aria-label={`Contact us on WhatsApp for the price of ${productName}`}
    >
      <MessageCircle className="w-5 h-5" />
      <span>Contact for Price</span>
    </button>
  );
}
