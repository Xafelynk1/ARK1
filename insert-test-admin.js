const { Pool } = require('pg');  // Assuming you're using pg for DB connections
const pool = new Pool({
  user: 'samuel chukwuemeke', // Updated username
  host: 'monorail.proxy.rlwy.net',
  database: 'railway',
  password: 'LViNhwXOeVyxooLBTpoWLuXPRPEavFNH', // Updated password
  port: 32474,
});

const insertAdminQuery = `
  INSERT INTO admins (username, password, confirm_password, email, safeword) 
  VALUES ('adminUser', 'adminPassword', 'adminPassword', 'admin@example.com', 'safeword123')
  ON CONFLICT (username) DO NOTHING;
`;

async function insertTestAdmin() {
  try {
    await pool.query(insertAdminQuery);
    console.log('Test admin user inserted (if it didn\'t exist already).');
  } catch (err) {
    console.error('Error inserting test admin:', err);
  } finally {
    await pool.end();  // Close the connection
  }
}

insertTestAdmin();
