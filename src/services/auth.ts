import sql, { ConnectionPool } from 'mssql';

export const getUserLogin = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { username: string };
}) => {
  const result = await pool
    .request()
    .input('username', sql.VarChar(10), values.username)
    .execute('fa_procGetUserLogin');

  return result;
};

export const getUserById = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { idUsuario: number };
}) => {
  const result = await pool
    .request()
    .input('id_usuario', sql.Int, values.idUsuario)
    .execute('fa_procGetUserById');

  return result;
};
