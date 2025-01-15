require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Use environment variable for connection string
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
        if (err.code === '23505') { // Unique violation error code
            console.error('Error registering user: Username already exists.'); // Log specific error
            return res.status(400).json({ error: 'Username already exists.' });
        }
        console.error('Error registering user:', err); // Log the error for debugging
        return res.status(500).json({ error: 'Error registering user' });
    }
});

// Admin login route
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    // Check credentials against environment variables
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid credentials' }); // Change back to 401 to match actual response
    }

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
    }

    try {
        const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
        const admin = result.rows[0];

        if (!admin || admin.password !== password) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Admin logged in successfully', admin }); // Ensure this is only sent once
    } catch (err) {
        console.error('Error logging in:', err); // Log the error for debugging
        return res.status(500).json({ error: 'Error logging in' });
    }
});

// Admin add user route
router.post('/admin/add-user', async (req, res) => {
    const { username, password, surname, email, dob } = req.body;
    if (!username || !password || !surname || !email || !dob) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const result = await pool.query('INSERT INTO "users" (username, password, surname, email, dob) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
            [username, password, surname, email, dob]);
        res.status(201).json({ message: 'User added successfully', user: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') { // Unique violation error code
            console.error('Error adding user: Username already exists.'); // Log specific error
            return res.status(400).json({ error: 'Username already exists.' });
        }
        console.error('Error adding user:', err); // Log the error for debugging
        return res.status(500).json({ error: 'Error adding user' });
    }
});

// Admin remove user route
router.delete('/admin/remove-user/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const result = await pool.query('DELETE FROM "users" WHERE username = $1 RETURNING *', [username]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User removed successfully' });
    } catch (err) {
        console.error('Error removing user:', err); // Log the error for debugging
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin assign role route
router.post('/admin/assign-role', async (req, res) => {
    const { username, role } = req.body;
    if (!username || !role) {
        return res.status(400).json({ error: 'Username and role are required' });
    }

    try {
        const result = await pool.query('UPDATE "users" SET role = $1 WHERE username = $2 RETURNING *', 
            [role, username]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User role assigned successfully', user: result.rows[0] });
    } catch (err) {
        console.error('Error assigning role:', err); // Log the error for debugging
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
