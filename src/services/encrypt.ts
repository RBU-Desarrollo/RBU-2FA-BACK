import sql, { ConnectionPool } from 'mssql';
import { User } from '../types/users';
import { convertVectorToString, decryptValue } from '../lib/crypto';

export const getUsersToEncrypt = async ({
  pool
}: {
  pool: ConnectionPool;
}): Promise<
  | Pick<
      User,
      | 'idUsuario'
      | 'usuario'
      | 'rut'
      | 'correoElectronico'
      | 'correoPersonal'
      | 'primerNombre'
      | 'segundoNombre'
      | 'apellidoPaterno'
      | 'apellidoMaterno'
    >[]
  | null
> => {
  const request = await pool.request().execute('fa_procGetUsersToEncrypt');

  if (!request || request.recordsets.length === 0) return null;

  const users = request.recordset;

  return users;
};

export const getUsersToDecrypt = async ({
  pool
}: {
  pool: ConnectionPool;
}): Promise<
  | Pick<
      User,
      | 'idUsuario'
      | 'usuario'
      | 'rut'
      | 'correoElectronico'
      | 'correoPersonal'
      | 'primerNombre'
      | 'segundoNombre'
      | 'apellidoPaterno'
      | 'apellidoMaterno'
    >[]
  | null
> => {
  const request = await pool.request().execute('fa_procGetUsersToDecrypt');

  if (!request || request.recordsets.length === 0) return null;

  const users = request.recordset;

  return users;
};

export const putEncryptUser = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: {
    idUsuario: number;
    iv: string;
    usuario: string;
    correoElectronico: string | null;
    correoPersonal: string | null;
    primerNombre: string;
    segundoNombre: string | null;
    apellidoPaterno: string;
    apellidoMaterno: string | null;
  };
}) => {
  const request = await pool
    .request()
    .input('id_usuario', sql.Int, values.idUsuario)
    .input('usuario', sql.VarChar(100), values.usuario)
    .input('correo_electronico', sql.VarChar(100), values.correoElectronico)
    .input('correo_personal', sql.VarChar(100), values.correoPersonal)
    .input('primer_nombre', sql.VarChar(100), values.primerNombre)
    .input('segundo_nombre', sql.VarChar(100), values.segundoNombre)
    .input('apellido_paterno', sql.VarChar(100), values.apellidoPaterno)
    .input('apellido_materno', sql.VarChar(100), values.apellidoMaterno)
    .execute('fa_procPutEncryptedUser');
  return request;
};

export const decryptedUserValues = (user: User): User => {
  const iv = convertVectorToString();
  const usuario = decryptValue({ iv, content: user.usuario });

  const correoElectronico = user.correoElectronico
    ? decryptValue({ iv, content: user.correoElectronico })
    : null;

  const correoPersonal = user.correoPersonal
    ? decryptValue({ iv, content: user.correoPersonal })
    : null;

  const primerNombre = decryptValue({ iv, content: user.primerNombre });
  const segundoNombre = user.segundoNombre
    ? decryptValue({ iv, content: user.segundoNombre })
    : null;
  const apellidoPaterno = decryptValue({
    iv,
    content: user.apellidoPaterno
  });
  const apellidoMaterno = user.apellidoMaterno
    ? decryptValue({ iv, content: user.apellidoMaterno })
    : null;

  user.usuario = usuario;
  user.rut = usuario;
  user.correoElectronico = correoElectronico;
  user.correoPersonal = correoPersonal;
  user.primerNombre = primerNombre;
  user.segundoNombre = segundoNombre;
  user.apellidoPaterno = apellidoPaterno;
  user.apellidoMaterno = apellidoMaterno;

  return user;
};
