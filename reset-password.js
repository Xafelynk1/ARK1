const { Pool } = require('pg');

const pool = new Pool({
  user: 'xafelynk1', // Updated username
  host: 'monorail.proxy.rlwy.net',
  database: 'railway',
  password: 'Sam1$12580064', // Updated password
  port: 32474, // Ensure this is the correct port
});

const resetPasswordQuery = `
  ALTER USER xafelynk1 WITH PASSWORD 'Sam1$12580064';
`;

async function resetPassword() {
  try {
    await pool.query(resetPasswordQuery);
    console.log('Password for user xafelynk1 has been reset successfully.');
  } catch (err) {
    console.error('Error resetting password:', err);
  } finally {
    await pool.end();  // Close the connection
  }
}

resetPassword();
