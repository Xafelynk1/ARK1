const express = require('express');
const router = express.Router();

router.post('/pay', async (req, res) => {
    console.log('Request Body:', req.body); // Debugging log
    const { amount, paymentMethod } = req.body;

    // Input validation
    if (!amount || !paymentMethod) {
        return res.status(400).json({ error: 'Amount and payment method are required' });
    }

    try {
        // Simulate payment processing (Replace with actual payment logic)
        // Here you would integrate with a payment gateway (e.g., Stripe, PayPal)
        console.log('Processing payment...'); // Debugging log
        return res.status(200).json({ message: 'Payment processed successfully' });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; // Ensure this exports the router instance
