import sql, { ConnectionPool } from 'mssql';

export const getRecoveryInstance = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { token: number };
}) => {
  const result = await pool
    .request()
    .input('token', sql.Int, values.token)
    .execute('fa_procGetRecoveryInstance');

  return result;
};

export const insRecoveryInstance = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { rut: string; token: number };
}) => {
  const result = await pool
    .request()
    .input('rut', sql.VarChar(100), values.rut)
    .input('token', sql.VarChar(200), values.token.toString())
    .execute('fa_procInsRecoveryInstance');

  return result;
};
