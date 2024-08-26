import { config } from 'dotenv';

const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
config({ path: envFile });

export const PORT = process.env.PORT || 4000;

export const DB_USER = process.env.DB_USER as string;
export const DB_PASSWORD = process.env.DB_PASSWORD as string;
export const DB_SERVER = process.env.DB_SERVER as string;
export const DB_DATABASE = process.env.DB_DATABASE as string;
