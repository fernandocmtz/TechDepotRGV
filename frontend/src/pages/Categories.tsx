import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

const Categories = () => {
  const { categories, loading } = useCategories();

  const [categoryData, setCategoryData] = useState<Record<string, number>>({});

  const loaded = !loading;

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">Product Categories</h1>
          <p className="text-muted-foreground">
            Browse our curated selection of high-quality tech components
            organized by category. Find exactly what you need for your next
            build or upgrade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loaded
            ? categories.map((category, index) => (
                <Link
                  key={category.category_id}
                  to={`/products?category=${category.name}`}
                  className="group relative overflow-hidden rounded-xl aspect-[4/3] animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-tech-dark/60 group-hover:bg-tech-dark/40 transition-colors duration-300 z-10" />
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                    <div className="bg-tech-blue/10 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium text-white w-fit mb-2">
                      {category.productCount == 1
                        ? `${category.productCount} Product`
                        : `${category.productCount} Products`}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {category.name}
                    </h3>

                    <div className="flex items-center text-white text-sm font-medium mt-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <span>Browse Products</span>
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </div>
                </Link>
              ))
            : // Skeleton loaders
              Array(6)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="rounded-xl overflow-hidden aspect-[4/3] bg-gray-200 animate-pulse"
                  />
                ))}
        </div>

        {/* Call to action */}
        <div className="mt-20 rounded-xl bg-tech-blue/5 p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-muted-foreground mb-6">
              We regularly update our inventory with the latest tech components.
              Check back often or contact our support team for special requests.
            </p>
            <Button
              variant="default"
              className="bg-tech-blue hover:bg-tech-blue/90 text-white btn-hover"
              asChild
            >
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
