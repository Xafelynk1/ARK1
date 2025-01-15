const express = require('express');
const router = express.Router();

const NeDB = require('nedb');
const db = new NeDB({ filename: 'server/database/ebooks.db', autoload: true });

// Route to upload an ebook
router.post('/upload', async (req, res) => {
    const { title, author, description, fileUrl } = req.body;

    // Input validation
    if (!title || !author || !description || !fileUrl) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Save the ebook details to the database
        const newEbook = { title, author, description, fileUrl };
        db.insert(newEbook, (err, ebook) => {
            if (err) {
                console.error('Error adding ebook:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            return res.status(201).json({ message: 'Ebook uploaded successfully', ebook });
        });
    } catch (error) {
        console.error('Error handling /upload:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
