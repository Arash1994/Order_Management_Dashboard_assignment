const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /orders — list all, optional ?status=Pending|Completed
router.get('/', (req, res) => {
  try {
    const { status } = req.query;
    let orders;
    if (status) {
      orders = db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC').all(status);
    } else {
      orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    }
    // Parse items JSON string
    orders = orders.map(o => ({ ...o, items: o.items ? JSON.parse(o.items) : [] }));
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /orders/:id — single order
router.get('/:id', (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    order.items = order.items ? JSON.parse(order.items) : [];
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /orders — create order
router.post('/', (req, res) => {
  try {
    const { customer, status = 'Pending', total, items = [] } = req.body;
    if (!customer || total === undefined) {
      return res.status(400).json({ success: false, error: 'customer and total are required' });
    }
    if (!['Pending', 'Completed'].includes(status)) {
      return res.status(400).json({ success: false, error: 'status must be Pending or Completed' });
    }
    const result = db
      .prepare('INSERT INTO orders (customer, status, total, items) VALUES (?, ?, ?, ?)')
      .run(customer, status, total, JSON.stringify(items));

    const created = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);
    created.items = created.items ? JSON.parse(created.items) : [];
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /orders/:id — update order
router.patch('/:id', (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const { customer, status, total, items } = req.body;

    if (status && !['Pending', 'Completed'].includes(status)) {
      return res.status(400).json({ success: false, error: 'status must be Pending or Completed' });
    }

    const updated = {
      customer: customer ?? order.customer,
      status: status ?? order.status,
      total: total ?? order.total,
      items: items !== undefined ? JSON.stringify(items) : order.items,
    };

    db.prepare(
      'UPDATE orders SET customer = ?, status = ?, total = ?, items = ? WHERE id = ?'
    ).run(updated.customer, updated.status, updated.total, updated.items, req.params.id);

    const result = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    result.items = result.items ? JSON.parse(result.items) : [];
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
