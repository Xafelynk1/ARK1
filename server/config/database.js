const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Use environment variable for connection string
});

module.exports = pool;
