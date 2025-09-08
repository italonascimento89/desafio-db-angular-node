import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'db_votacao',
  password: 'admin123',
  port: 5432,
});

export default pool;
