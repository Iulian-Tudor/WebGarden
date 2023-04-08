CREATE DATABASE IF NOT EXISTS web_gardening;

USE web_gardening;

-- Table for user data
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  address VARCHAR(255),
  cart_details TEXT
);

CREATE TABLE IF NOT EXISTS flowers (
  flower_id INT AUTO_INCREMENT PRIMARY KEY,
  seller_id INT NOT NULL,
  category_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  user_description TEXT,
  image_url VARCHAR(255),
  flower_type VARCHAR(50) NOT NULL,
  FOREIGN KEY (seller_id) REFERENCES users(user_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id),
  FOREIGN KEY (flower_type) REFERENCES flower_data(flower_type)
);

-- Table for flower data
CREATE TABLE IF NOT EXISTS flower_data (
  flower_type VARCHAR(50) PRIMARY KEY,
  optimal_soil TEXT,
  optimal_humidity TEXT,
  general_description TEXT,
  general_biological_data TEXT,
  season VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  flower_id INT NOT NULL,
  order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  order_status VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (flower_id) REFERENCES flowers(flower_id)
);

CREATE TABLE IF NOT EXISTS categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(50) NOT NULL,
  category_description TEXT
);

CREATE TABLE IF NOT EXISTS transactions (
  transaction_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  flower_id INT NOT NULL,
  transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  transaction_amount DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (flower_id) REFERENCES flowers(flower_id)
);
