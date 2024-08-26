import { config } from 'mssql';
import { DB_DATABASE, DB_PASSWORD, DB_PORT, DB_SERVER, DB_USER } from './env';

const dbConfig: config = {
  user: DB_USER,
  password: DB_PASSWORD,
  server: DB_SERVER,
  database: DB_DATABASE,
  port: DB_PORT,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    packetSize: 16368
  }
};

export default dbConfig;
