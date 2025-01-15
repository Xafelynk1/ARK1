const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(express.static(path.join(__dirname, '../public'))); // Update path to serve from the correct location

let quizzes = [];
let blogs = [];
let multimedia = [];

const usersDB = require('./config/database'); // Assuming you have a database pool setup

// Endpoint to handle user signup
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await usersDB.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password]);
        res.status(201).json({ success: true, message: 'User registered successfully!', user: result.rows[0] });
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).json({ success: false, message: 'Error saving user.' });
    }
});

app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await usersDB.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        res.status(200).json({ success: true, message: 'Signin successful!', user });
    } catch (err) {
        console.error('Error during signin:', err);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// Endpoint to submit a blog
app.post('/submit-blog', (req, res) => {
    const { title, content } = req.body;
    blogs.push({ title, content });
    res.status(201).send('Blog submitted successfully!');
});

const adminRoutes = require('./routes/admin'); // Import admin routes

app.use('/admin', adminRoutes); // Register admin routes

// Endpoint to get all submissions
app.get('/submissions', (req, res) => {
    res.json({ quizzes, blogs, multimedia });
});

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
