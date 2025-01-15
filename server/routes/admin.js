const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // Updated to correct database connection

console.log('Fetching users...'); // Log to confirm the request is received
// Endpoint to get users with their roles
router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, surname, email, dob, role FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to update user role
router.put('/users/:id/role', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const result = await pool.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING *', [role, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating user role:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
