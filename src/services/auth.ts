import sql, { ConnectionPool } from 'mssql';

export const getUserLoginFromDatabase = async ({
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

export const insOTPCodeToDatabase = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { idUsuario: number; otp: number };
}) => {
  const result = await pool
    .request()
    .input('idUsuario', sql.Int, values.idUsuario)
    .input('otp', sql.Int, values.otp)
    .execute('fa_procInsOTP');

  return result;
};
