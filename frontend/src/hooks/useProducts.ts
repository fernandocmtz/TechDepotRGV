// src/hooks/useProducts.ts
import { useState, useEffect, useCallback } from "react";
import { Product } from "@/services/types";
import { api_get_all_products } from "@/services/api";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api_get_all_products();
      setProducts(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refresh: fetchProducts };
}