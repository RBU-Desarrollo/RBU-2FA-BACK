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
  values: { correo: string; token: number };
}) => {
  const result = await pool
    .request()
    .input('correo', sql.VarChar(50), values.correo)
    .input('token', sql.VarChar(200), values.token.toString())
    .execute('fa_procInsRecoveryInstance');

  return result;
};
