import sql, { ConnectionPool } from 'mssql';
import { Acceso, Modulo, Sistema, User } from '../types/users';
import { removeDuplicateObjects } from '../utils/array';
import {
  capitalizeEveryWord,
  formatObjectToCamelCase
} from '../utils/formatters';
import { decryptedUserValues } from './encrypt';

export const getUserById = async ({
  pool,
  values
}: {
  pool: any;
  values: { idUsuario: number };
}): Promise<User | null> => {
  const request = await pool
    .request()
    .input('id_usuario', sql.Int, values.idUsuario)
    .execute('fa_procGetUserById');

  if (request.recordsets.length === 0) return null;

  let userData = formatObjectToCamelCase(request.recordsets[0][0]);
  const accessData = request.recordsets[1].map((acc: any) =>
    formatObjectToCamelCase(acc)
  );
  const modulesData = request.recordsets[2].map((mod: any) =>
    formatObjectToCamelCase(mod)
  );
  const systemsData = request.recordsets[3].map((sys: any) =>
    formatObjectToCamelCase(sys)
  );

  const modulos: Modulo[] = removeDuplicateObjects(
    modulesData.map((item: any) => ({
      idSistema: item.idSistema,
      idModulo: item.idModulo,
      nombre: item.nombre
    }))
  );

  const accesos: Acceso[] = removeDuplicateObjects(
    accessData.map((item: any) => ({
      idSistema: item.idSistema,
      idModulo: item.idModulo,
      idAcceso: item.idAcceso,
      nombre: item.nombre
    }))
  );

  userData = decryptedUserValues(userData);

  const user: User = {
    idUsuario: userData.idUsuario,
    usuario: userData.usuario,
    rut: userData.rut,
    primerNombre: capitalizeEveryWord(userData.primerNombre),
    segundoNombre: userData.segundoNombre
      ? capitalizeEveryWord(userData.segundoNombre)
      : null,
    apellidoPaterno: capitalizeEveryWord(userData.apellidoPaterno),
    apellidoMaterno: userData.apellidoMaterno
      ? capitalizeEveryWord(userData.apellidoMaterno)
      : null,
    correoElectronico: userData.correoElectronico,
    correoPersonal: userData.correoPersonal,
    telefono: userData.telefono,
    direccion: userData.direccion,
    perfil: {
      idPerfil: userData.idPerfil,
      rol: userData.rol
    },
    zona: {
      idZona: userData.idZona,
      nombre: userData.nombreZona,
      abreviado: userData.abreviadoZona
    },
    fechaCreacion: userData.fechaCreacion,
    fechaNuevaPassword: userData.fechaNuevaPassword,
    sistemas: systemsData.map((sistema: Sistema) => ({
      ...sistema,
      modulos: modulos
        .filter((modulo: Modulo) => modulo.idSistema === sistema.idSistema)
        .map((modulo: Modulo) => {
          const { idSistema, ...restModulo } = modulo;
          return {
            ...restModulo,
            accesos: accesos
              .filter(
                (acceso: Acceso) =>
                  acceso.idSistema === modulo.idSistema &&
                  acceso.idModulo === modulo.idModulo
              )
              .map((acceso: Acceso) => {
                const { idSistema, idModulo, ...restAcceso } = acceso;
                return restAcceso;
              })
          };
        })
    }))
  };

  return user;
};

export const updateUserById = async ({
  pool,
  values
}: {
  pool: ConnectionPool;
  values: {
    idUsuario: string;
    telefono: string | null;
    direccion: string | null;
  };
}) => {
  const result = await pool
    .request()
    .input('id_usuario', sql.Int, values.idUsuario)
    .input('telefono', sql.VarChar(20), values.telefono)
    .input('direccion', sql.VarChar(100), values.direccion)
    .execute('fa_procPutUserData');

  return result;
};
