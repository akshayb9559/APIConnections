require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'api_connections'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Create items table if not exists
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description VARCHAR(200),
        price DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

db.query(createTableQuery, (err) => {
    if (err) {
        console.error('Error creating table:', err);
    }
});

// API Routes
// Create item
app.post('/api/items', (req, res) => {
    const { name, description, price, quantity } = req.body;
    
    const query = 'INSERT INTO items (name, description, price, quantity) VALUES (?, ?, ?, ?)';
    db.query(query, [name, description, price, quantity], (err, result) => {
        if (err) {
            console.error('Error creating item:', err);
            return res.status(500).json({ error: 'Error creating item' });
        }
        res.status(201).json({ id: result.insertId });
    });
});

// Get all items
app.get('/api/items', (req, res) => {
    const query = 'SELECT * FROM items';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching items:', err);
            return res.status(500).json({ error: 'Error fetching items' });
        }
        res.json(results);
    });
});

// Get single item
app.get('/api/items/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM items WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching item:', err);
            return res.status(500).json({ error: 'Error fetching item' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(results[0]);
    });
});

// Update item
app.put('/api/items/:id', (req, res) => {
    const id = req.params.id;
    const { name, description, price, quantity } = req.body;
    
    const query = 'UPDATE items SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?';
    db.query(query, [name, description, price, quantity, id], (err, result) => {
        if (err) {
            console.error('Error updating item:', err);
            return res.status(500).json({ error: 'Error updating item' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ message: 'Item updated successfully' });
    });
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM items WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting item:', err);
            return res.status(500).json({ error: 'Error deleting item' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
