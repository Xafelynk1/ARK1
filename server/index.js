const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const firebaseConfig = require('./config/firebase');
const ebookRoutes = require('./routes/ebooks');
const authRoutes = require('./routes/auth'); // Ensure authRoutes is imported

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Firebase initialization
const admin = require('firebase-admin');
admin.initializeApp(firebaseConfig);

// Paystack initialization
const paystackConfig = require('./config/paystack'); // Import Paystack config
const paystack = require('paystack')(paystackConfig.secretKey); // Use the imported config

// Route definitions
app.use('/api/auth', authRoutes);
app.use('/api/ebooks', ebookRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
