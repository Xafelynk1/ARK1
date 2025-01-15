const { Pool } = require('pg');

// Simulated database connection
const pool = new Pool({
  user: 'simulated_user', // Simulated username
  host: 'localhost', // Simulated host
  database: 'simulated_db', // Simulated database
  password: 'simulated_password', // Simulated password
  port: 5432, // Default PostgreSQL port
});

const createAdminsTableQuery = `
  CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    confirm_password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    safeword VARCHAR(255) NOT NULL
  );
`;

const insertAdminQuery = `
  INSERT INTO admins (username, password, confirm_password, email, safeword) 
  VALUES ('xafelynkark2', 'Sam1$12580064', 'Sam1$12580064', 'samuelchukwuemeke05@gmail.com', 'safewordi123')
  ON CONFLICT (username) DO NOTHING;
`;

async function setupDatabase() {
  try {
    await pool.query(createAdminsTableQuery);
    console.log('Admins table created (if it didn\'t exist already).');
    
    await pool.query(insertAdminQuery);
    console.log('Test admin user inserted (if it didn\'t exist already).');
  } catch (err) {
    console.error('Error setting up simulated database:', err);
  } finally {
    await pool.end();  // Close the connection
  }
}

setupDatabase();
