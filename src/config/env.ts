import { config } from 'dotenv';

config();

export const PORT = process.env.PORT || 4000;

export const EMAIL_API_ENDPOINT = process.env.EMAIL_API_ENDPOINT as string;

export const DB_USER = process.env.DB_USER as string;
export const DB_PASSWORD = process.env.DB_PASSWORD as string;
export const DB_SERVER = process.env.DB_SERVER as string;
export const DB_DATABASE = process.env.DB_DATABASE as string;
export const DB_PORT = parseInt(process.env.DB_PORT || '2021', 10) as number;

export const JWT_SECRET = process.env.JWT_SECRET as string;
