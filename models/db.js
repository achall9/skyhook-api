import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const db = process.env.NODE_ENV === 'test' ? 'skyhooktest' : 'skyhook'
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: db,
  port: process.env.DB_PORT
});

export default pool;
