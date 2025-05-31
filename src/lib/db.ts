
// src/lib/db.ts
import { Pool, type QueryResult } from 'pg';

let pool: Pool | null = null;

function initializePool() {
  if (pool) {
    return pool;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('[DB] SERVER ERROR: DATABASE_URL environment variable is not set.');
    // In a real app, you might throw an error or handle this more gracefully
    // For now, query will fail if pool is not initialized.
    return null;
  }

  try {
    console.log('[DB] SERVER: Attempting to create new PostgreSQL connection pool...');
    pool = new Pool({
      connectionString: databaseUrl,
      // Consider adding SSL configuration if required by your provider
      // ssl: {
      //   rejectUnauthorized: process.env.NODE_ENV === 'production', // Adjust as needed
      // },
      max: 10, // Max number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 5000, // How long to wait for a connection to be established
    });

    pool.on('connect', () => {
      console.log('[DB] SERVER: New client connected to the PostgreSQL pool.');
    });

    pool.on('error', (err, client) => {
      console.error('[DB] SERVER ERROR: Unexpected error on idle client in pool', err);
      // process.exit(-1); // Optional: exit if critical
    });
    console.log('[DB] SERVER: PostgreSQL connection pool initialized.');
    return pool;
  } catch (error) {
    console.error('[DB] SERVER ERROR: Failed to initialize PostgreSQL connection pool:', error);
    pool = null; // Ensure pool is null if initialization fails
    return null;
  }
}

// Initialize pool on module load
initializePool();

export async function query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  if (!pool) {
    console.error('[DB] SERVER ERROR: query called but connection pool is not initialized. Trying to re-initialize...');
    initializePool(); // Attempt to re-initialize
    if (!pool) {
      throw new Error('Database pool is not initialized and re-initialization failed. Check DATABASE_URL and server logs.');
    }
  }

  const start = Date.now();
  try {
    const client = await pool.connect();
    try {
      const res = await client.query<T>(text, params);
      const duration = Date.now() - start;
      console.log('[DB] SERVER: Executed query', { text: text.substring(0, 100) + (text.length > 100 ? '...' : ''), duration: `${duration}ms`, rows: res.rowCount });
      return res;
    } finally {
      client.release();
    }
  } catch (error) {
    const duration = Date.now() - start;
    console.error('[DB] SERVER ERROR: Error executing query', { text: text.substring(0,100)+'...', duration: `${duration}ms`, error });
    throw error;
  }
}

export async function testDbConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW()');
    console.log('[DB] SERVER: Database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('[DB] SERVER ERROR: Database connection test failed:', error);
    return false;
  }
}
