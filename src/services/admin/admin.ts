import { ConnectionPool } from 'mssql';

export const getAdminContent = async ({ pool }: { pool: ConnectionPool }) => {
  const request = await pool.request().execute('fa_procGetAdminContent');
  return request;
};
