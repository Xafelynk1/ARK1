const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const paymentRouter = require('../server/routes/payment');
const mockPool = require('../mock-db'); // Import the mock database

const app = express();
app.use(bodyParser.json());
app.use('/api', paymentRouter); // Fixed syntax error: added a comma

describe('Payment Processing', () => {
    it('should process payment successfully', async () => {
        const response = await request(app)
            .post('/api/pay')
            .send({
                amount: 100,
                paymentMethod: 'creditCard',
            });

        console.log('Test Response:', response.body); // Debugging log
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Payment processed successfully');
    });

    it('should return an error for missing fields', async () => {
        const response = await request(app)
            .post('/api/pay')
            .send({
                // Missing amount and paymentMethod
            });

        console.log('Test Response:', response.body); // Debugging log
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Amount and payment method are required');
    });
});

afterAll(async () => {
    await mockPool.end(); // Close the mock database connection after all tests
});
