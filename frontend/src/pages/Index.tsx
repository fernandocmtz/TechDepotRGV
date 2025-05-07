import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useEffect } from "react";

const Index = () => {
  const {
    products: productsV2,
    loading: productsLoading,
    refresh,
  } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Can move this to backend
  const featuredProducts = [...productsV2]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  const productsLoaded = !productsLoading;
  const categoriesLoaded = !categoriesLoading;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-tech-dark/80 to-tech-dark/40 z-10" />
          <img
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Technology"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-20 mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-medium text-tech-blue bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full mb-4 animate-fade-in">
              Premium Tech Components
            </span>
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-up"
              style={{ animationDelay: "100ms" }}
            >
              Build Your Perfect System with Premium Components
            </h1>
            <p
              className="text-lg text-white/80 mb-8 leading-relaxed animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              Discover our meticulously curated selection of high-quality tech
              components, designed for professionals, enthusiasts, and gamers
              who demand nothing but the best.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <Button
                size="lg"
                className="bg-tech-blue hover:bg-tech-blue/90 text-white btn-hover"
                asChild
              >
                <Link to="/products">Shop All Products</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 btn-hover"
                asChild
              >
                <Link to="/categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-tech-light">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
            <div>
              <span className="text-sm font-medium text-tech-blue">
                Discover
              </span>
              <h2 className="text-3xl font-bold mt-1">Featured Products</h2>
            </div>
            <Button
              variant="link"
              asChild
              className="text-tech-blue no-underline"
            >
              <Link to="/products" className="flex items-center">
                View all products <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsLoaded
              ? featuredProducts.map((product, index) => (
                  <div
                    key={product.product_id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              : // Skeleton loaders
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl overflow-hidden border border-border/40 animate-pulse"
                    >
                      <div className="h-56 bg-gray-200" />
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
                  ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-medium text-tech-blue">
              Categories
            </span>
            <h2 className="text-3xl font-bold mt-1 mb-4">Find What You Need</h2>
            <p className="text-muted-foreground">
              Browse our wide selection of components, organized by category for
              easy navigation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriesLoaded
              ? categories.map((category, index) => (
                  <Link
                    key={category.category_id}
                    to={`/products?category=${category.category_id}`}
                    className="group relative h-64 rounded-xl overflow-hidden animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-tech-dark/80 to-tech-dark/20 group-hover:opacity-90 transition-opacity z-10" />
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {category.name}
                        </h3>
                        <span className="inline-flex items-center text-sm font-medium text-white/90 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                          Explore <ArrowRight className="ml-1 h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              : // Skeleton loaders
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="relative h-64 rounded-xl overflow-hidden bg-gray-200 animate-pulse"
                    />
                  ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-tech-blue/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="glass bg-white/60 rounded-2xl p-8 md:p-12 shadow-sm border border-white/40 max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Build Your Dream System?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust us for their
                tech component needs. Start shopping today and experience the
                difference.
              </p>
              <Button
                size="lg"
                className="bg-tech-blue hover:bg-tech-blue/90 text-white btn-hover"
                asChild
              >
                <Link to="/products">Shop All Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
