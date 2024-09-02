import sql, { ConnectionPool } from 'mssql';

export const getVerifyPasswordDate = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { username: string };
}) => {
  const result = await pool
    .request()
    .input('username', sql.VarChar(50), values.username)
    .execute('fa_procGetUserPasswordValid');

  return result;
};
