const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const dropUsersTable = () => {
  const query = 'DROP TABLE IF EXISTS users';

  pool
    .query(query)
    .then(() => console.log('Users table deleted successfully'))
    .catch((err) => console.error('Failed to delete users table', err));
};

const createUsersTable = () => {
  const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        spins INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

  pool
    .query(query)
    .then(() => console.log('Users table created successfully'))
    .catch((err) => console.error('Failed to create users table', err));
};

createUsersTable();

module.exports = pool;
