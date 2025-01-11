const axios = require('axios');

const secretKey = process.env.PAYSTACK_SECRET_KEY; // Ensure this is the correct key
const baseURL = "https://api.paystack.co";

const paystackAPI = axios.create({
    baseURL,
    headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
    },
});

const initializePayment = async (data) => {
    try {
        const response = await paystackAPI.post('/transaction/initialize', data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const verifyPayment = async (reference) => {
    try {
        const response = await paystackAPI.get(`/transaction/verify/${reference}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

module.exports = {
    initializePayment,
    verifyPayment,
};
