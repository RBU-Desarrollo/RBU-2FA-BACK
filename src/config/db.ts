import { config } from 'mssql';
import { DB_DATABASE, DB_PASSWORD, DB_SERVER, DB_USER } from './env';

const dbConfig: config = {
  user: DB_USER,
  password: DB_PASSWORD,
  server: DB_SERVER,
  database: DB_DATABASE
};

export default dbConfig;
