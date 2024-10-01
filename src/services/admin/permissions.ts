import sql, { ConnectionPool } from 'mssql';

export const getPermissions = async ({
  pool,
  idPerfil
}: {
  pool: ConnectionPool;
  idPerfil: number;
}) => {
  const request = await pool
    .request()
    .input('id_perfil', sql.Int, idPerfil)
    .execute('fa_procGetPermissions');
  return request.recordset;
};

export const insPermission = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: {
    idPerfil: number;
    idSistema: number;
    idModulo: number;
    idAcceso: number;
  };
}) => {
  const request = await pool
    .request()
    .input('id_perfil', sql.Int, values.idPerfil)
    .input('id_sistema', sql.Int, values.idSistema)
    .input('id_modulo', sql.Int, values.idModulo)
    .input('id_acceso', sql.Int, values.idAcceso)
    .execute('fa_procInsPermission');
  return request;
};

export const delPermissions = async ({
  pool,
  idPerfil
}: {
  pool: ConnectionPool;
  idPerfil: number;
}) => {
  const request = await pool
    .request()
    .input('id_perfil', sql.Int, idPerfil)
    .execute('fa_procDelPermissions');
  return request;
};
