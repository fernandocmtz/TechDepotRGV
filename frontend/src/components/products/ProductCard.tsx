import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/services/types";
import { useCart } from "@/context/cart/useCart";
import { toast } from "@/hooks/use-toast";

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product.product_id, 1);

    toast({
      title: "Success",
      description: "Added to cart",
    });
  };

  const isOutOfStock = product.inventory_count === 0;
  const isLowStock = product.inventory_count > 0 && product.inventory_count < 5;

  return (
    <div
      className={cn(
        "product-card rounded-xl overflow-hidden bg-white border border-border/40 relative flex flex-col h-full",
        className
      )}
    >
      <div className="overflow-hidden aspect-[4/3] bg-tech-muted">
        <img
          src={product.image_url}
          alt={product.name}
          className={cn(
            "object-cover w-full h-full animate-image",
            imageLoaded ? "image-loaded" : "image-loading"
          )}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-tech-blue bg-tech-blue/10 px-2 py-1 rounded-full inline-block mb-2 w-fit">
            {product.Category.name}
          </span>

          {isOutOfStock && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full w-fit mb-2">
              Out of Stock
            </span>
          )}

          {isLowStock && !isOutOfStock && (
            <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full w-fit mb-2">
              Only {product.inventory_count} left
            </span>
          )}
        </div>

        <Link to={`/products/${product.product_id}`}>
          <h3 className="font-medium text-lg hover:text-tech-blue transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-muted-foreground text-sm mt-2 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-lg">
            ${Number(product.price).toFixed(2)}
          </span>

          <Button
            size="sm"
            variant="outline"
            className="hover:bg-tech-blue hover:text-white transition-colors"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
