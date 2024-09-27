import sql, { ConnectionPool } from 'mssql';

export const putUser = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: {
    idUsuario: number;
    usuario: string;
    correoElectronico: string;
    telefono?: string | null;
    direccion?: string | null;
    idZona?: number | null;
    idPerfil: number;
  };
}) => {
  const request = await pool
    .request()
    .input('id_usuario', sql.Int, values.idUsuario)
    .input('usuario', sql.VarChar(50), values.usuario)
    .input('correo_electronico', sql.VarChar(50), values.correoElectronico)
    .input('telefono', sql.VarChar(20), values.telefono)
    .input('direccion', sql.VarChar(100), values.direccion)
    .input('id_zona', sql.Int, values.idZona)
    .input('id_perfil', sql.Int, values.idPerfil)
    .execute('fa_procPutAdminUser');
  return request;
};
