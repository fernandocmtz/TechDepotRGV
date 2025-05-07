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
  inventory_count: number;
};

export type ProductFilters = {
  category_id?: number;
  minPrice?: number;
  maxPrice?: number;
  product_ids?: number[];
};

export type Category = {
  category_id: number;
  name: string;
  productCount: number;
  image_url: string;
};

export type CartItem = {
  product_id: number;
  quantity: number;
  product_inventory: number;
};

export type OrderData = {
  address: OrderAddressData;
};

export type OrderAddressData = {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};
