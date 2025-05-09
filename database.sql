
-- Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    role VARCHAR(100) NOT NULL DEFAULT 'user',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Products Table
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Inventory Table
CREATE TABLE inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Addresses Table
CREATE TABLE addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_id INT NOT NULL,
    total_paid DECIMAL(10,2) DEFAULT 0,
    status ENUM('pending', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES addresses(address_id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    inventory_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id) ON DELETE CASCADE
);

-- Payments Table
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status ENUM('pending', 'completed', 'failed') NOT NULL,
    method ENUM('credit_card', 'paypal', 'crypto', 'cash_on_delivery') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Shipments Table
CREATE TABLE shipments (
    shipment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_item_id INT NOT NULL,
    courier VARCHAR(100) NOT NULL,
    status ENUM('pending', 'shipped', 'delivered', 'returned') DEFAULT 'pending',
    tracking_number VARCHAR(100) UNIQUE,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id) ON DELETE CASCADE
);

-- Returns Table
CREATE TABLE returns (
    return_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    order_item_id INT NOT NULL,
    reason TEXT,
    return_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('requested', 'approved', 'rejected', 'processed') DEFAULT 'requested',
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id) ON DELETE CASCADE
);

-- Payment Methods Table
CREATE TABLE payment_methods (
  method_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  cardholder_name VARCHAR(100) NOT NULL,
  card_last4 VARCHAR(4) NOT NULL,
  expiration_date VARCHAR(7) NOT NULL, -- Format: MM/YYYY
  brand ENUM('visa', 'mastercard', 'amex', 'paypal') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
