import { useState, memo } from "react";
import { Button } from "./ui/Button";
import { useCartStore } from "../store";
import { WishlistButton } from "./WishlistButton";
import { OptimizedImage } from "./OptimizedImage";
import { Eye, ShoppingCart, Star } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";
import { sendProductInquiry } from "../utils/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { PriceOrInquiry } from "./PriceOrInquiry";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  /** When true, render "Ask Price" WhatsApp CTA instead of an amount. */
  hidePrice?: boolean;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  onAddToCart?: (productId: string) => void;
  onClick?: () => void;
  product?: any; // Full product object for quick view
  onQuickView?: (product: any) => void; // Callback for quick view
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  hidePrice,
  image,
  rating,
  reviewCount,
  inStock,
  onAddToCart,
  onClick,
  product,
  onQuickView,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);

    try {
      addToCart({
        productId: id,
        name,
        price,
        image,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        quantity: 1,
      });

      if (onAddToCart) {
        onAddToCart(id);
      }

      // Reset button state after animation
      setTimeout(() => setIsAdding(false), 500);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setIsAdding(false);
    }
  };


  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 cursor-pointer h-full flex flex-col group hover:-translate-y-1"
    >
      {/* Image — square aspect, contain so the whole product is visible */}
      <div
        className="relative w-full aspect-square bg-gradient-to-br from-amber-50/60 to-orange-50/40 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <OptimizedImage
          src={image}
          alt={name}
          className={`w-full h-full object-contain p-4 transition-transform duration-500 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
              -{discount}%
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <WishlistButton
          id={id}
          name={name}
          price={price}
          image={image}
          className="absolute top-3 left-3 z-20"
        />

        {/* Out of Stock veil */}
        {!inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 bg-gray-900/80 text-white text-sm font-semibold rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick View on hover */}
        {isHovered && inStock && (
          <div className="absolute inset-x-0 bottom-0 p-3 pointer-events-none">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView?.(product);
              }}
              className="pointer-events-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur text-gray-900 font-semibold text-sm rounded-xl hover:bg-white transition-all shadow-lg"
            >
              <Eye className="w-4 h-4" />
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
        {/* Title */}
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
          {name}
        </h3>

        {/* Price + tiny rating */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <PriceOrInquiry
              productName={name}
              price={price}
              hidePrice={hidePrice}
              variant="card"
            />
            {!hidePrice && originalPrice && originalPrice > price && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {rating > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-600 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
              {reviewCount > 0 && (
                <span className="text-gray-400">({reviewCount})</span>
              )}
            </span>
          )}
        </div>

        {/* Action(s) */}
        <div className="mt-auto pt-1">
          {hidePrice ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sendProductInquiry(name, price, { showPrice: false });
              }}
              disabled={!inStock}
              className="w-full py-2.5 rounded-xl font-semibold bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
              title="Ask price on WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Contact for Price
            </button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleAddToCart}
                disabled={!inStock || isAdding}
                variant={inStock ? "primary" : "secondary"}
                className="flex-1 py-2.5 rounded-xl font-semibold transition-all"
                size="sm"
              >
                {isAdding ? (
                  <span>Adding...</span>
                ) : inStock ? (
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </span>
                ) : (
                  "Out of Stock"
                )}
              </Button>
              <Button
                onClick={() => sendProductInquiry(name, price)}
                variant="secondary"
                className="py-2.5 px-3 rounded-xl bg-green-500 hover:bg-green-600 text-white border-none transition-all"
                size="sm"
                title="Order via WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(ProductCard);
