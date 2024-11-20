import sql, { ConnectionPool } from 'mssql';

export const getOTPCode = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { idUsuario: number; otp: number };
}) => {
  const result = await pool
    .request()
    .input('id_usuario', sql.Int, values.idUsuario)
    .input('otp', sql.Int, values.otp)
    .execute('fa_procGetOTP');

  return result;
};

export const insOTPCode = async ({
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

export const delOTPCode = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { idUsuario: number };
}): Promise<boolean> => {
  try {
    await pool
      .request()
      .input('id_usuario', sql.Int, values.idUsuario)
      .execute('fa_procDelOTPByUserId');

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const insBloqueoOtp = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { idUsuario: number };
}) => {
  const result = await pool
    .request()
    .input('idUsuario', sql.Int, values.idUsuario)
    .execute('fa_procInsBloqueoOTP');

  return result;
};
