const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const db = new Database(path.join(dataDir, 'business.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const initSQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  role TEXT CHECK(role IN ('owner', 'staff')) DEFAULT 'staff',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  name TEXT NOT NULL,
  category TEXT CHECK(category IN ('main', 'reseller')) DEFAULT 'main',
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  status TEXT CHECK(status IN ('pending', 'processing', 'delivered', 'returned')) DEFAULT 'pending',
  total_amount DECIMAL(10,2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  order_id TEXT NOT NULL,
  method TEXT CHECK(method IN ('cash', 'bank', 'easypaisa', 'jazzcash', 'other')) DEFAULT 'cash',
  status TEXT CHECK(status IN ('paid', 'unpaid', 'partial')) DEFAULT 'unpaid',
  amount DECIMAL(10,2) NOT NULL,
  transaction_ref TEXT,
  paid_at DATETIME,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Inventory logs table
CREATE TABLE IF NOT EXISTS inventory_logs (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  product_id TEXT NOT NULL,
  change_type TEXT CHECK(change_type IN ('add', 'sale', 'adjustment')) DEFAULT 'add',
  quantity INTEGER NOT NULL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Marketing posts table
CREATE TABLE IF NOT EXISTS marketing_posts (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  platform TEXT CHECK(platform IN ('facebook', 'linkedin', 'whatsapp')) DEFAULT 'facebook',
  content TEXT NOT NULL,
  image_url TEXT,
  status TEXT CHECK(status IN ('scheduled', 'posted', 'failed')) DEFAULT 'scheduled',
  scheduled_at DATETIME,
  posted_at DATETIME
);

-- Insert default admin user (password: admin123)
INSERT OR IGNORE INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@business.com', '$2a$10$rOzJlZ8nJvLT3bFnGN.zLuK6xN5cV9h8.LhqE5wFE4uJzN.FGMJ6e', 'owner');

-- Insert sample products
INSERT OR IGNORE INTO products (name, category, description, price, stock) VALUES 
('Premium Shilajit', 'main', 'Pure Himalayan Shilajit', 2500.00, 50),
('Almonds 1KG', 'main', 'Premium quality almonds', 1200.00, 30),
('Pure Honey 500g', 'main', 'Natural honey from local farms', 800.00, 25),
('Shilajit Drops', 'main', 'Liquid shilajit drops', 1500.00, 40),
('Mixed Dry Fruits', 'reseller', 'Assorted dry fruits pack', 900.00, 20);
`;

// Execute initialization SQL
try {
  db.exec(initSQL);
  console.log('✅ Database initialized successfully');
} catch (error) {
  console.error('❌ Database initialization failed:', error.message);
} finally {
  db.close();
}
