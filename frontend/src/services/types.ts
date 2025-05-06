export type Product = {
  product_id: number;
  name: string;
  description: string;
  price: string;
  category_id: number;
  image_url: string;
  createdAt: string;
  updatedAt: string;
  Category: {
    name: string;
  };
};

export type ProductFilters = {
  category_id?: number;
  minPrice?: number;
  maxPrice?: number;
};

export type Category = {
  category_id: number;
  name: string;
  productCount: number;
  image_url: string;
};
