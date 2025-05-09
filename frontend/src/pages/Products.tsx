import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProducts, getCategories } from "@/services/productService";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/services/types";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { products: productsV2, refresh, loading } = useProducts();
  const { categories: categoriesV2 } = useCategories();

  const queryCategoryId = searchParams.get("category")
    ? Number(searchParams.get("category"))
    : null;

  const queryCategory = categoriesV2.find(
    (category: Category) => category.category_id === queryCategoryId
  );

  const [activeCategory, setActiveCategory] = useState({
    category_id: null,
    name: "All Products",
  } as Category);

  useEffect(() => {
    if (queryCategory) {
      setActiveCategory(queryCategory);
    } else if (!queryCategoryId) {
      setActiveCategory({
        category_id: null,
        name: "All Products",
      } as Category);
    }
  }, [queryCategory, queryCategoryId]);

  useEffect(() => {
    if (activeCategory.category_id) {
      refresh({
        category_id: activeCategory.category_id,
      });
    } else {
      refresh();
    }
  }, [activeCategory, refresh]);

  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({
    min: "",
    max: "",
  });
  const [filtersVisible, setFiltersVisible] = useState(false);

  const categories = useMemo(
    () => [
      { category_id: null, name: "All Products" } as Category,
      ...categoriesV2,
    ],
    [categoriesV2]
  );

  const displayedProducts = useMemo(() => {
    if (searchQuery) {
      return productsV2.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return productsV2;
  }, [productsV2, searchQuery]);

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    setPriceRange({ min: "", max: "" });
    setSearchQuery("");

    refresh({
      category_id: category.category_id,
    });
  };

  const handlePriceFilter = () => {
    refresh({
      category_id: activeCategory.category_id,
      minPrice: priceRange.min ? Number(priceRange.min) : undefined,
      maxPrice: priceRange.max ? Number(priceRange.max) : undefined,
    });
  };

  const clearFilters = () => {
    handleCategoryChange(activeCategory);
  };

  const loaded = !loading;

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar for desktop */}
          <div className="hidden md:block md:col-span-3 lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.category_id}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start ${
                      activeCategory.category_id === category.category_id
                        ? "bg-accent text-tech-blue font-medium"
                        : ""
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="font-semibold mb-4">Price Range</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      min={priceRange.min || 0}
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handlePriceFilter}
                >
                  Apply
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-9 lg:col-span-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{activeCategory.name}</h1>
                <p className="text-muted-foreground mt-1">
                  {loaded
                    ? `${displayedProducts.length} products available`
                    : "Loading products..."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <form className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-10 w-full max-w-[200px] sm:max-w-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>

                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setFiltersVisible(!filtersVisible)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mobile filters */}
            {filtersVisible && (
              <div className="md:hidden bg-muted/50 rounded-lg p-4 border border-border animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFiltersVisible(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Tabs defaultValue="categories">
                  <TabsList className="w-full">
                    <TabsTrigger value="categories" className="flex-1">
                      Categories
                    </TabsTrigger>
                    <TabsTrigger value="price" className="flex-1">
                      Price
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="categories" className="pt-4 space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.category_id}
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start ${
                          activeCategory.category_id === category.category_id
                            ? "bg-accent text-tech-blue font-medium"
                            : ""
                        }`}
                        onClick={() => {
                          handleCategoryChange(category);
                          setFiltersVisible(false);
                        }}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </TabsContent>

                  <TabsContent value="price" className="pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              min: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              max: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        handlePriceFilter();
                        setFiltersVisible(false);
                      }}
                    >
                      Apply
                    </Button>
                  </TabsContent>
                </Tabs>

                <Separator className="my-4" />

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    clearFilters();
                    setFiltersVisible(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loaded ? (
                productsV2.length > 0 ? (
                  displayedProducts.map((product, index) => (
                    <div
                      key={product.product_id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${(index % 4) * 100}ms` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-xl font-medium mb-2">
                      No products found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try changing your filters or search query
                    </p>
                    <Button onClick={clearFilters}>Clear All Filters</Button>
                  </div>
                )
              ) : (
                // Skeleton loaders
                Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl overflow-hidden border border-border/40 animate-pulse"
                    >
                      <div className="h-48 bg-gray-200" />
                      <div className="p-4">
                        <div className="w-16 h-5 bg-gray-200 rounded-full mb-3" />
                        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4" />
                        <div className="h-4 bg-gray-200 rounded mb-2" />
                        <div className="h-4 bg-gray-200 rounded mb-2 w-4/5" />
                        <div className="flex justify-between items-center mt-4">
                          <div className="w-16 h-6 bg-gray-200 rounded" />
                          <div className="w-20 h-8 bg-gray-200 rounded" />
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
