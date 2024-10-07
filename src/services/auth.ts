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
    .input('username', sql.VarChar(50), values.username)
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

export const getUserByEmail = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { correo: string };
}) => {
  const result = await pool
    .request()
    .input('correo', sql.VarChar(100), values.correo)
    .execute('fa_procGetUserByEmail');

  return result;
};

export const getUserEmail = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { rut: string };
}) => {
  const result = await pool
    .request()
    .input('rut', sql.VarChar(100), values.rut)
    .execute('fa_procGetUserEmail');

  return result;
};

export const putLastAccessDate = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { idUsuario: number };
}) => {
  const result = await pool
    .request()
    .input('id_usuario', sql.Int, values.idUsuario)
    .execute('fa_procPutLastAccessDate');

  return result;
};
