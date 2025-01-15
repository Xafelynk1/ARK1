const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// Initialize PostgreSQL client
const pool = new Pool({
    connectionString: 'postgresql://postgres:LViNhwXOeVyxooLBTpoWLuXPRPEavFNH@monorail.proxy.rlwy.net:32474/railway',
});

// User registration route
router.post('/register', async (req, res) => {
    const { username, password, surname, email, dob } = req.body;
    if (!username || !password || !surname || !email || !dob) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const result = await pool.query('INSERT INTO "users" (username, password, surname, email, dob) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
            [username, password, surname, email, dob]);
        res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (err) {
        console.error('Error registering user:', err); // Log the error for debugging
        return res.status(400).json({ error: 'Error registering user' });
    }
});

router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM "admins" WHERE username = $1 AND password = $2', [username, password]);
        const admin = result.rows[0];
        if (!admin) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        res.status(200).json({ message: 'Admin logged in successfully', admin });
    } catch (err) {
        console.error('Error logging in:', err); // Log the error for debugging
        return res.status(400).json({ error: 'Error logging in' });
    }
});

module.exports = router;
