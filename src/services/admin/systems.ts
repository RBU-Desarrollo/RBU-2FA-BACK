import sql, { ConnectionPool } from 'mssql';

export const insSystem = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: {
    nombre: string;
    url: string;
    imageUrl: string;
  };
}) => {
  const request = await pool
    .request()
    .input('nombre', sql.VarChar(20), values.nombre)
    .input('url', sql.VarChar(100), values.url)
    .input('image_url', sql.VarChar(225), values.imageUrl)
    .execute('fa_procInsSystem');
  return request;
};

export const putSystem = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: {
    idSistema: number;
    nombre: string;
    url: string;
    imageUrl: string;
  };
}) => {
  const request = await pool
    .request()
    .input('id_sistema', sql.Int, values.idSistema)
    .input('nombre', sql.VarChar(20), values.nombre)
    .input('url', sql.VarChar(100), values.url)
    .input('image_url', sql.VarChar(225), values.imageUrl)
    .execute('fa_procPutSystem');
  return request;
};

export const delSystem = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { id: string };
}) => {
  const request = await pool
    .request()
    .input('id_sistema', sql.Int, values.id)
    .execute('fa_procDelSystem');
  return request;
};
