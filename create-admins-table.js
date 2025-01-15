const { Pool } = require('pg');  // Assuming you're using pg for DB connections
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  );
`;

async function createAdminsTable() {
  try {
    await pool.query(createTableQuery);
    console.log('Admins table created (if it didn\'t exist already).');
  } catch (err) {
    console.error('Error creating admins table:', err);
  } finally {
    await pool.end();  // Close the connection
  }
}

createAdminsTable();
