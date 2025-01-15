const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const NeDB = require('nedb');

const app = express();
const PORT = process.env.PORT || 8080; // Changed port to 8080

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new NeDB({ filename: 'server/database/users.db', autoload: true });

// Routes
const authRoutes = require('./server/routes/auth');
const ebookRoutes = require('./server/routes/ebooks');

app.use('/auth', authRoutes);
app.use('/ebooks', ebookRoutes);

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
