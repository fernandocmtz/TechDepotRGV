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

export type FetchOrderItems = {
  orderedItems: FetchNonReturnedOrderItems[];
  returnedItems: FetchReturnedItems[];
};

export type FetchNonReturnedOrderItems = {
  ordered_at: string;
  order_item_id: number;
  order_id: number;
  product_name: string;
  price: number;
  order_status: string;
  shipment_status: string;
};

export type FetchReturnedItems = {
  ordered_at: string;
  order_item_id: number;
  order_id: number;
  product_name: string;
  price: number;
  status: string;
};

export type PostReturn = {
  order_item_id: number;
  reason: string;
};

export type PostProduct = {
  name: string;
  description: string;
  price: string;
  category_id: number;
  image_url: string;
};

export type FetchInventoryWithProductName = {
  inventory_id: number;
  sku: string;
  product_id: number;
  createdAt: string;
  updatedAt: string;
  Product: {
    name: string;
  };
};

export type PostPutInventory = {
  product_id: number;
  sku: string;
};
