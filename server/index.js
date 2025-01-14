const express = require('express');
const path = require('path');
const session = require('express-session');
const multer = require('multer');

const app = express();

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use original file name
  }
});

// Initialize multer
const upload = multer({ storage: storage });

// Login route
app.post('/login', (req, res) => {
  // Simple hardcoded credentials for demonstration
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    req.session.authenticated = true;
    res.redirect('/');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (req.session.authenticated) {
    return next();
  }
  res.status(403).send('Access denied. Please login first.');
};

// Handle file upload (protected route)
app.post('/upload', requireAuth, upload.single('file'), (req, res) => {
  res.send('File uploaded successfully!');
});

const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
