
import { ProductProps } from '@/components/products/ProductCard';

// Initial products data
const initialProducts: ProductProps[] = [
  {
    id: "1",
    name: "AMD Ryzen 9 5900X",
    description: "12-core, 24-thread processor with 3.7 GHz base clock and boost up to 4.8 GHz. Perfect for high-end gaming and content creation.",
    price: 549.99,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Processors"
  },
  {
    id: "2",
    name: "NVIDIA GeForce RTX 3080",
    description: "High-end graphics card with 10GB GDDR6X memory, ray tracing support, and exceptional 4K gaming performance.",
    price: 699.99,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Graphics Cards"
  },
  {
    id: "3",
    name: "Corsair Vengeance RGB Pro 32GB",
    description: "High-performance DDR4 memory kit with 32GB (2x16GB) capacity, RGB lighting, and support for Intel and AMD platforms.",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1592664474898-4611403afd1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Memory"
  },
  {
    id: "4",
    name: "Samsung 970 EVO Plus 1TB",
    description: "High-speed NVMe SSD with read speeds up to 3,500 MB/s and write speeds up to 3,300 MB/s for ultra-fast storage performance.",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Storage"
  },
  {
    id: "5",
    name: "ASUS ROG Strix X570-E Gaming",
    description: "Premium ATX motherboard for AMD Ryzen processors with PCIe 4.0, Wi-Fi 6, and RGB lighting.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Motherboards"
  },
  {
    id: "6",
    name: "Corsair RM850x Power Supply",
    description: "Fully modular 850W power supply with 80 PLUS Gold certification for high efficiency and reliable power delivery.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1625235853497-2a3e58eaf8e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Power Supplies"
  }
];

// In a real app, this would be stored in a database
let products = [...initialProducts];

// Get all products with optional filtering
export const getProducts = (category?: string) => {
  if (category) {
    return products.filter(product => product.category === category);
  }
  return [...products];
};

// Get a single product by ID
export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
};

// Get all unique categories
export const getCategories = () => {
  const categories = products.map(product => product.category);
  return [...new Set(categories)];
};

// Add a new product
export const addProduct = (product: Omit<ProductProps, 'id'>) => {
  const newProduct = {
    ...product,
    id: Date.now().toString()
  };
  
  products.push(newProduct);
  return newProduct;
};

// Update an existing product
export const updateProduct = (id: string, updatedProduct: Partial<ProductProps>) => {
  const index = products.findIndex(product => product.id === id);
  
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    return products[index];
  }
  
  return null;
};

// Delete a product
export const deleteProduct = (id: string) => {
  const initialLength = products.length;
  products = products.filter(product => product.id !== id);
  
  return initialLength !== products.length;
};

// For development/testing - reset to initial data
export const resetProducts = () => {
  products = [...initialProducts];
  return products;
};
