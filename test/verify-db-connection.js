const { Pool } = require('pg');

const pool = new Pool({
  user: 'xafelynkark2', // Ensure this is correct
  host: 'monorail.proxy.rlwy.net',
  database: 'railway',
  password: 'Sam1$12580064', // Ensure this is correct
  port: 32474,
});

pool.connect()
  .then(() => {
    console.log('Connected to the database successfully!');
    pool.end();
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });
