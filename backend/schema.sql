-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255),
  outlets TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create outlets table
CREATE TABLE IF NOT EXISTS outlets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  fssai_number VARCHAR(50),
  opening_time TIME,
  closing_time TIME,
  active BOOLEAN DEFAULT TRUE,
  wallet DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  outlet_id INTEGER REFERENCES outlets(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  outlet_id INTEGER REFERENCES outlets(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  gst_percent DECIMAL(5, 2),
  is_available BOOLEAN DEFAULT TRUE,
  is_veg BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) DEFAULT 0,
  user_email VARCHAR(255),
  user_phone VARCHAR(20),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email);
CREATE INDEX IF NOT EXISTS idx_outlets_active ON outlets(active);
CREATE INDEX IF NOT EXISTS idx_items_outlet_id ON items(outlet_id);
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_wallets_user_email ON wallets(user_email);
