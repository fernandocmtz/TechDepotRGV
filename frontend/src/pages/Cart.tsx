import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProductById } from "@/services/productService";
import { ProductProps } from "@/components/products/ProductCard";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/context/cart/useCart";
import { useProducts } from "@/hooks/useProducts";
import { CartItem, Product } from "@/services/types";

const Cart = () => {
  const { cartItems: cartItemsV2, updateCartItem, removeFromCart } = useCart();
  const { products, refresh, loading, clear } = useProducts();

  const productIds = useMemo(
    () => cartItemsV2.map((item) => item.product_id),
    [cartItemsV2]
  );

  useEffect(() => {
    if (productIds.length === 0) {
      clear();
      return;
    }

    refresh({ product_ids: productIds });
  }, [productIds, refresh, clear]);

  const mergeProductsAndCart = (products: Product[], cartItems: CartItem[]) => {
    // 1️⃣ build a map: product_id → quantity
    const qtyMap = new Map<number, number>(
      cartItems.map(({ product_id, quantity }) => [product_id, quantity])
    );

    // 2️⃣ map each product, pulling quantity from the map (default 0)
    return products.map((product) => ({
      ...product,
      quantity: qtyMap.get(product.product_id) || 0,
    }));
  };
  const mergedProducts = mergeProductsAndCart(products, cartItemsV2);

  const updateQuantity = (
    productId: number,
    newQuantity: number,
    productInventory: number
  ) => {
    if (newQuantity < 1) return;

    updateCartItem(productId, newQuantity, productInventory);
  };

  const removeItem = (productId: number) => {
    removeFromCart(productId);
    toast({
      title: "Success",
      description: "Item removed from cart",
    });
  };

  const subtotal = mergedProducts.reduce((sum, item) => {
    return sum + Number(item.price) * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    toast({
      title: "Success",
      description: "Checkout functionality would go here in a real app",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {loading ? (
          <div className="animate-pulse space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col md:flex-row gap-4 pb-8">
                <div className="bg-gray-200 rounded-xl h-24 w-24" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/5" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-28 bg-gray-200 rounded" />
                  <div className="h-10 w-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : mergedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-border/40 overflow-hidden">
                <div className="p-6 space-y-6">
                  {mergedProducts.map((item, index) => (
                    <div key={item.product_id}>
                      {index > 0 && <Separator className="my-6" />}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Link
                          to={`/products/${item.product_id}`}
                          className="block"
                        >
                          <div className="aspect-square w-20 h-20 bg-muted rounded-md overflow-hidden">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>

                        <div className="flex-1">
                          <Link
                            to={`/products/${item.product_id}`}
                            className="text-lg font-medium hover:text-tech-blue transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {item.Category.name}
                          </p>
                          <p className="text-lg font-bold mt-1">
                            ${item.price}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="flex items-center border border-input rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  item.quantity - 1,
                                  item.inventory_count
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  item.quantity + 1,
                                  item.inventory_count
                                )
                              }
                              disabled={item.quantity >= item.inventory_count}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.product_id)}
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link to="/products" className="flex items-center">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-xl border border-border/40 sticky top-24">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (7%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 bg-tech-blue hover:bg-tech-blue/90 text-white"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Checkout
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Shipping and taxes calculated at checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-xl border border-border/40">
            <div className="max-w-md mx-auto">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button asChild>
                <Link to="/products">Start Shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
