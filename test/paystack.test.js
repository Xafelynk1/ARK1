const { initializePayment, verifyPayment } = require('../server/config/paystack');

describe('Paystack API Integration', () => {
    test('should initialize payment successfully', async () => {
        const paymentData = {
            email: 'test@example.com',
            amount: 5000, // Amount in kobo
        };
        const response = await initializePayment(paymentData);
        expect(response).toHaveProperty('status', 'success');
    });

    test('should verify payment successfully', async () => {
        const reference = 'sk_live_b3650a731895f94418ca43d4a7867c9dfa707e58'; // Use a valid reference
        const response = await verifyPayment(reference);
        expect(response).toHaveProperty('status', 'success');
    });
});
