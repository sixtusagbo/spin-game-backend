const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    spins INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )
`;

pool
  .query(createUsersTable)
  .then(() => console.log('Users table created successfully'))
  .catch((err) => console.error('Failed to create users table', err));

const dropUsersTable = 'DROP TABLE IF EXISTS users';

module.exports = pool;
