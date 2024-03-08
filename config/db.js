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
        name VARCHAR(100) NOT NULL,
        username VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        spins SMALLINT DEFAULT 0,
        spin_result BOOLEAN DEFAULT false,
        max_spins SMALLINT DEFAULT ${process.env.MAX_SPINS},
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

  pool
    .query(query)
    .then(() => console.log('Users table created successfully'))
    .catch((err) => console.error('Failed to create users table', err));
};

const updateSpinStatus = async (userId, spinSuccess) => {
  const query = `
    UPDATE users 
    SET spins = spins + 1, 
        spin_result = $2 
    WHERE id = $1 
    RETURNING *
  `;

  const values = [userId, spinSuccess];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const updateMaxSpins = async (userId, value) => {
  const query = `
    UPDATE users 
    SET max_spins = $2
    WHERE id = $1 
    RETURNING *
  `;

  const values = [userId, value];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const selectAllUsers = async () => {
  const result = await pool.query('SELECT * FROM users');

  return result.rows;
};

const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

  return result.rows[0];
};

module.exports = {
  pool,
  selectAllUsers,
  updateMaxSpins,
  updateSpinStatus,
  getUserById,
};
