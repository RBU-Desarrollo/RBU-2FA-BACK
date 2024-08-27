import sql, { ConnectionPool } from 'mssql';
import { hashPassword } from '../lib/bcrypt';

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
