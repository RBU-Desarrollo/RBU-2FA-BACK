import { ConnectionPool } from 'mssql';
import dbConfig from '../config/db';

let pool: ConnectionPool | null = null;

export const connectDB = async () => {
  if (!pool) {
    try {
      pool = await new ConnectionPool(dbConfig).connect();
      console.log('Connected to SQL Server database');
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw error;
    }
  }
  return pool;
};

export const isDBConnected = async (): Promise<boolean> => {
  try {
    const pool = await connectDB();
    await pool.request().query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Error checking database connection:', error);
    return false;
  }
};
