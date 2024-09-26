import sql, { ConnectionPool } from 'mssql';

export const insModule = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: {
    nombre: string;
  };
}) => {
  const request = await pool
    .request()
    .input('nombre', sql.VarChar(50), values.nombre)
    .execute('fa_procInsModule');
  return request;
};

export const putModule = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: {
    idModulo: number;
    nombre: string;
  };
}) => {
  const request = await pool
    .request()
    .input('id_modulo', sql.Int, values.idModulo)
    .input('nombre', sql.VarChar(50), values.nombre)
    .execute('fa_procPutModule');
  return request;
};

export const delModule = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { id: string };
}) => {
  const request = await pool
    .request()
    .input('id_modulo', sql.Int, values.id)
    .execute('fa_procDelModule');
  return request;
};
