import sql, { ConnectionPool } from 'mssql';

export const getActiveToken = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { idUsuario: string; token: string };
}) => {
  const result = await pool
    .request()
    .input('id_usuario', sql.Int, values.idUsuario)
    .input('token', sql.VarChar(132), values.token)
    .output('isValid', sql.Bit)
    .execute('fa_procGetActiveToken');

  return result;
};

export const postActiveToken = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { idUsuario: string; token: string };
}) => {
  const result = await pool
    .request()
    .input('id_usuario', sql.Int, values.idUsuario)
    .input('token', sql.VarChar(132), values.token)
    .execute('fa_procInsActiveToken');

  return result;
};
