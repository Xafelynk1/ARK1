const { Pool } = require('pg');

const pool = new Pool({
  user: 'xafelynkark2',
  host: 'monorail.proxy.rlwy.net',
  database: 'railway',
  password: 'Sam1$12580064',
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
