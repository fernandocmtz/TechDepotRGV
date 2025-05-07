// src/hooks/useProducts.ts
import { useState, useEffect, useCallback } from "react";
import { Product, ProductFilters } from "@/services/types";
import {
  api_get_all_products,
  api_get_filtered_products,
} from "@/services/api";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async (filters?: ProductFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = filters
        ? await api_get_filtered_products(filters)
        : await api_get_all_products();

      setProducts(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearProducts = useCallback(() => {
    setProducts([]);
  }, []);

  return {
    products,
    loading,
    error,
    refresh: fetchProducts,
    clear: clearProducts,
  };
}
