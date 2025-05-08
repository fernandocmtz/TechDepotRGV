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
  products: OrderProductsData[];
  paymentDetails: OrderPaymentData;
};

export type OrderAddressData = {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
};

export type OrderProductsData = {
  product_id: number;
  quantity: number;
};

export type OrderPaymentData = {
  card_name: string;
  card_number: string;
  card_expiry: string;
  card_cvv: string;
};
