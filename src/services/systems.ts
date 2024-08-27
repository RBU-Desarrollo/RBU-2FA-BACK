import { ConnectionPool } from 'mssql';

export const getSystems = async ({ pool }: { pool: ConnectionPool }) => {
  const result = await pool.request().execute('fa_procGetSystems');

  return result.recordset;
};
