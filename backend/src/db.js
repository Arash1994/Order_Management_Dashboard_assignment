const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const DB_PATH = path.join(dataDir, 'orders.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    customer    TEXT    NOT NULL,
    status      TEXT    NOT NULL DEFAULT 'Pending',
    total       REAL    NOT NULL,
    items       TEXT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// Seed sample data only if table is empty
const count = db.prepare('SELECT COUNT(*) as c FROM orders').get();
if (count.c === 0) {
  const insert = db.prepare(
    'INSERT INTO orders (customer, status, total, items) VALUES (?, ?, ?, ?)'
  );

  const seed = db.transaction(() => {
    insert.run('Alice Johnson', 'Completed', 149.99, JSON.stringify([
      { name: 'Wireless Headphones', qty: 1, price: 99.99 },
      { name: 'Phone Case', qty: 2, price: 25.00 },
    ]));
    insert.run('Bob Smith', 'Pending', 89.50, JSON.stringify([
      { name: 'Mechanical Keyboard', qty: 1, price: 89.50 },
    ]));
    insert.run('Carol White', 'Completed', 320.00, JSON.stringify([
      { name: 'Smart Watch', qty: 1, price: 250.00 },
      { name: 'Watch Band', qty: 2, price: 35.00 },
    ]));
    insert.run('David Lee', 'Pending', 54.99, JSON.stringify([
      { name: 'USB-C Hub', qty: 1, price: 54.99 },
    ]));
    insert.run('Emma Davis', 'Pending', 199.00, JSON.stringify([
      { name: 'Bluetooth Speaker', qty: 1, price: 129.00 },
      { name: 'Laptop Stand', qty: 1, price: 70.00 },
    ]));
    insert.run('Frank Brown', 'Completed', 79.95, JSON.stringify([
      { name: 'Mouse Pad XL', qty: 1, price: 29.95 },
      { name: 'Webcam', qty: 1, price: 50.00 },
    ]));
  });

  seed();
  console.log('✅ Database seeded with sample orders');
}

module.exports = db;
