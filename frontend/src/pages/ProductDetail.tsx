import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProductById, getProducts } from "@/services/productService";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Minus, ShoppingCart, Check } from "lucide-react";
import ProductCard, { ProductProps } from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/cart/useCart";
import { add } from "date-fns";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products, refresh, loading } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Fetch all products to ensure we have the latest data
    const fetchProducts = async () => {
      const fetchedProduct = await refresh({ product_ids: [Number(id)] });

      if (fetchedProduct.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Product not found",
        });
        navigate("/products");
      }
    };
    fetchProducts();
  }, [id, refresh, navigate]);

  const product = products.find((product) => product.product_id === Number(id));

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.product_id, quantity);

    toast({
      title: "Success",
      description: `Added ${quantity} ${
        quantity === 1 ? "item" : "items"
      } to cart`,
    });

    setQuantity(1);
  };

  const isLoaded = !loading;

  if (!isLoaded) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="animate-pulse">
            <div className="h-6 w-24 bg-gray-200 rounded mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded-xl aspect-square" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-2 w-4/5" />
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/5" />
                <div className="h-8 bg-gray-200 rounded w-1/4 mt-6" />
                <div className="h-12 bg-gray-200 rounded mt-4" />
                <div className="h-12 bg-gray-200 rounded mt-4" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-6 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/products">Browse All Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const isOutOfStock = product.inventory_count === 0;
  const isLowStock = product.inventory_count > 0 && product.inventory_count < 5;

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link to="/products" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative rounded-xl overflow-hidden border border-border/40 bg-muted/50">
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                <div className="w-10 h-10 border-4 border-tech-blue/30 border-t-tech-blue rounded-full animate-spin" />
              </div>
            )}
            <img
              src={product.image_url}
              alt={product.name}
              className={`w-full aspect-square object-cover transition-opacity duration-500 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <span className="inline-block text-sm font-medium text-tech-blue bg-tech-blue/10 px-3 py-1 rounded-full mb-4 w-fit">
              {product.Category.name}
            </span>

            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-tech-dark">
                ${product.price}
              </span>
              {!isOutOfStock && !isLowStock && (
                <span className="ml-2 text-sm text-muted-foreground">
                  In stock
                </span>
              )}
              {isLowStock && (
                <span className="ml-2 text-sm text-yellow-500">
                  Only {product.inventory_count} left
                </span>
              )}
              {isOutOfStock && (
                <span className="ml-2 text-sm text-red-500">Out of stock</span>
              )}
            </div>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

            <Separator className="mb-8" />

            <div className="space-y-6">
              {/* Quantity selector */}
              {!isOutOfStock && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Quantity
                  </label>
                  <div className="flex items-center w-fit border border-input rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Add to cart button */}
              <Button
                size="lg"
                className="w-full bg-tech-blue hover:bg-tech-blue/90 text-white"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              </Button>
            </div>

            <Separator className="my-8" />

            {/* Additional product information */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Category:</span>{" "}
                {product.Category.name}
              </div>
              <div>
                <span className="font-medium">Product ID:</span>{" "}
                {product.product_id}
              </div>
              <div>
                <span className="font-medium">Warranty:</span> 12 months
              </div>
              <div>
                <span className="font-medium">Shipping:</span> Free
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
