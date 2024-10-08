import sql, { ConnectionPool, pool } from 'mssql';

export const getUserByRut = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { rut: string; normalRut: string };
}) => {
  const request = await pool
    .request()
    .input('rut', sql.VarChar(100), values.rut)
    .input('normal_rut', sql.VarChar(100), values.normalRut)
    .execute('fa_procSearchUser');
  return request;
};

export const insUser = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: {
    password: string;
    rut: string;
    primerNombre: string;
    segundoNombre?: string | null;
    apellidoPaterno: string;
    apellidoMaterno?: string | null;
    correoElectronico?: string | null;
    correoPersonal?: string | null;
    idZona?: number | null;
    idPerfil: number;
  };
}) => {
  const request = await pool
    .request()
    .input('username', sql.VarChar(100), values.rut)
    .input('password', sql.VarChar(255), values.password)
    .input('rut', sql.VarChar(100), values.rut)
    .input('primerNombre', sql.VarChar(100), values.primerNombre)
    .input('segundoNombre', sql.VarChar(100), values.segundoNombre)
    .input('apellidoPaterno', sql.VarChar(100), values.apellidoPaterno)
    .input('apellidoMaterno', sql.VarChar(100), values.apellidoMaterno)
    .input('correoElectronico', sql.VarChar(100), values.correoElectronico)
    .input('correoPersonal', sql.VarChar(100), values.correoPersonal)
    .input('idZona', sql.Int, values.idZona ?? null)
    .input('idPerfil', sql.Int, values.idPerfil)
    .execute('fa_procInsUser');
  return request;
};

export const putUser = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: {
    idUsuario: number;
    correoElectronico?: string | null;
    correoPersonal?: string | null;
    telefono?: string | null;
    direccion?: string | null;
    idZona?: number | null;
    idPerfil: number;
  };
}) => {
  const request = await pool
    .request()
    .input('id_usuario', sql.Int, values.idUsuario)
    .input('correo_electronico', sql.VarChar(100), values.correoElectronico)
    .input('correo_personal', sql.VarChar(100), values.correoPersonal)
    .input('telefono', sql.VarChar(20), values.telefono)
    .input('direccion', sql.VarChar(100), values.direccion)
    .input('id_zona', sql.Int, values.idZona)
    .input('id_perfil', sql.Int, values.idPerfil)
    .execute('fa_procPutAdminUser');
  return request;
};

export const delUser = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { idUsuario: number };
}) => {
  const request = await pool
    .request()
    .input('id_usuario', sql.Int, values.idUsuario)
    .execute('fa_procDeactivateUser');
  return request;
};

export const activateUser = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: { idUsuario: number };
}) => {
  const request = await pool
    .request()
    .input('id_usuario', sql.Int, values.idUsuario)
    .execute('fa_procActivateUser');
  return request;
};
