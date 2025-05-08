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

export type PatchUser = {
  email: FetchedUser["email"];
  phone_number: FetchedUser["phone_number"];
};

export type FetchedUser = {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string | null;
  role: string;
};

export type FetchedAddress = {
  address_id: number;
  user_id: number;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
};

export type PostPutAddress = {
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  zip_code: string;
  country: string;
};
