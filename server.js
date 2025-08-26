const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        db.run(`CREATE TABLE volunteers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            location TEXT
        )`);
    }
});

// Register Volunteer
app.post('/register', (req, res) => {
    const { name, email, location } = req.body;
    db.run(
        `INSERT INTO volunteers (name, email, location) VALUES (?, ?, ?)`,
        [name, email, location],
        function (err) {
            if (err) {
                return res.status(400).json({ error: 'Email already exists or invalid data' });
            }
            res.status(200).json({ id: this.lastID });
        }
    );
});

// Fetch Volunteers by Location
app.get('/volunteers', (req, res) => {
    const location = req.query.location || '';
    const query = location
        ? `SELECT * FROM volunteers WHERE location LIKE ?`
        : `SELECT * FROM volunteers`;
    db.all(query, [`%${location}%`], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});