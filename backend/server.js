const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const pool = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test Database Connection
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected!', time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// ==================== VENDORS ====================
// Get all vendors
app.get('/api/vendors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vendors ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// Create vendor
app.post('/api/vendors', async (req, res) => {
  try {
    const { name, email, phone, password, outlets } = req.body;
    const result = await pool.query(
      'INSERT INTO vendors (name, email, phone, password, outlets) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone, password, outlets]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create vendor' });
  }
});

// Update vendor
app.put('/api/vendors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, outlets } = req.body;
    const result = await pool.query(
      'UPDATE vendors SET name=$1, email=$2, phone=$3, outlets=$4 WHERE id=$5 RETURNING *',
      [name, email, phone, outlets, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update vendor' });
  }
});

// Delete vendor
app.delete('/api/vendors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM vendors WHERE id=$1', [id]);
    res.json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete vendor' });
  }
});

// ==================== OUTLETS (using STALLS table) ====================
// Get all outlets (from stalls table)
app.get('/api/outlets', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, description, image_url, admin_id, opening_time, closing_time, is_available FROM stalls ORDER BY created_datetime DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch outlets' });
  }
});

// Create outlet (in stalls table)
app.post('/api/outlets', async (req, res) => {
  try {
    const { name, description, admin_id, opening_time, closing_time, owner_id } = req.body;
    const result = await pool.query(
      `INSERT INTO stalls (id, name, description, admin_id, opening_time, closing_time, owner_id, is_available, created_datetime, updated_datetime) 
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, true, NOW(), NOW()) RETURNING id, name, description, admin_id, opening_time, closing_time, is_available`,
      [name, description, admin_id, opening_time, closing_time, owner_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create outlet' });
  }
});

// Update outlet (in stalls table)
app.put('/api/outlets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, opening_time, closing_time, is_available } = req.body;
    const result = await pool.query(
      `UPDATE stalls SET name=$1, description=$2, opening_time=$3, closing_time=$4, is_available=$5, updated_datetime=NOW() 
       WHERE id=$6 RETURNING id, name, description, opening_time, closing_time, is_available`,
      [name, description, opening_time, closing_time, is_available, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update outlet' });
  }
});

// Delete outlet (from stalls table)
app.delete('/api/outlets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM stalls WHERE id=$1', [id]);
    res.json({ message: 'Outlet deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete outlet' });
  }
});

// ==================== WALLETS ====================
// Get all wallets
app.get('/api/wallets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM wallets ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch wallets' });
  }
});

// Create wallet
app.post('/api/wallets', async (req, res) => {
  try {
    const { user_name, amount, user_email, user_phone } = req.body;
    const result = await pool.query(
      'INSERT INTO wallets (user_name, amount, user_email, user_phone) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_name, amount, user_email, user_phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create wallet' });
  }
});

// Update wallet
app.put('/api/wallets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const result = await pool.query(
      'UPDATE wallets SET amount=$1 WHERE id=$2 RETURNING *',
      [amount, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update wallet' });
  }
});

// Delete wallet
app.delete('/api/wallets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM wallets WHERE id=$1', [id]);
    res.json({ message: 'Wallet deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete wallet' });
  }
});

// ==================== ITEMS ====================
// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Create item (accepts stall_id or outlet_id, both map to stall_id)
app.post('/api/items', async (req, res) => {
  try {
    const { outlet_id, stall_id, category_id, name, description, price, gst_percent, is_available, is_veg, admin_id, manager_id } = req.body;
    // Use stall_id if provided, otherwise use outlet_id (for compatibility)
    const stallId = stall_id || outlet_id;
    
    if (!stallId) {
      return res.status(400).json({ error: 'stall_id or outlet_id is required' });
    }
    
    const result = await pool.query(
      `INSERT INTO items (id, stall_id, category_id, name, description, price, final_price, Gst_precentage, is_available, is_veg, admin_id, manager_id, created_datetime, updated_datetime) 
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $5, $6, $7, $8, $9, $10, NOW(), NOW()) RETURNING id, name, description, price, final_price, Gst_precentage, is_available, is_veg, stall_id, category_id`,
      [stallId, category_id, name, description, price, gst_percent || 0, is_available || true, is_veg || false, admin_id, manager_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create item', details: err.message });
  }
});

// Update item
app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, gst_percent, is_available, is_veg } = req.body;
    const result = await pool.query(
      `UPDATE items SET name=$1, description=$2, price=$3, final_price=$3, Gst_precentage=$4, is_available=$5, is_veg=$6, updated_datetime=NOW() 
       WHERE id=$7 RETURNING id, name, description, price, final_price, Gst_precentage, is_available, is_veg`,
      [name, description, price, gst_percent, is_available, is_veg, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM items WHERE id=$1', [id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Database connected successfully!');
});
