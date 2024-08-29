import sql, { ConnectionPool } from 'mssql';
import { hashPassword } from '../lib/bcrypt';

export const getUserPassword = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { idUsuario: number };
}) => {
  const result = await pool
    .request()
    .input('id_usuario', sql.Int, values.idUsuario)
    .execute('fa_procGetUserPassword');

  return result;
};

export const putUpdatePassword = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { idUsuario: number; password: string };
}) => {
  const hashedPassword = await hashPassword(values.password);

  const result = await pool
    .request()
    .input('id_usuario', sql.Int, values.idUsuario)
    .input('hashed_password', sql.VarChar(72), hashedPassword)
    .execute('fa_procPutUpdatePassword');

  return result;
};
