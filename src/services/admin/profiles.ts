import sql, { ConnectionPool } from 'mssql';

export const insProfile = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { rol: string };
}) => {
  const request = await pool
    .request()
    .input('rol', sql.VarChar(50), values.rol)
    .execute('fa_procInsProfile');
  return request;
};

export const putProfile = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { idPerfil: number; rol: string };
}) => {
  const request = await pool
    .request()
    .input('id_perfil', sql.Int, values.idPerfil)
    .input('rol', sql.VarChar(50), values.rol)
    .execute('fa_procPutProfile');
  return request;
};

export const delProfile = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { id: number };
}) => {
  const request = await pool
    .request()
    .input('id_perfil', sql.Int, values.id)
    .execute('fa_procDelProfile');
  return request;
};
