import { Acceso, Modulo, Sistema, User } from '../types/users';
import { removeDuplicateObjects } from '../utils/array';
import { formatObjectToCamelCase } from '../utils/formatters';

export const getUserById = async ({
  pool,
  values
}: {
  pool: any;
  values: { idUsuario: number };
}): Promise<User | null> => {
  const request = await pool
    .request()
    .input('id_usuario', values.idUsuario)
    .execute('fa_procGetUserById');

  if (request.recordset.length === 0) return null;

  const data = request.recordset.map((row: any) =>
    formatObjectToCamelCase(row)
  );

  const accesos: Acceso[] = data.map((item: any) => ({
    idAcceso: item.idAcceso,
    nombre: item.acceso
  }));
  const modulos: Modulo[] = removeDuplicateObjects(
    data.map((item: any) => ({
      idModulo: item.idModulo,
      nombre: item.modulo
    }))
  );
  const sistemas: Sistema[] = removeDuplicateObjects(
    data.map((item: any) => ({
      idSistema: item.idSistema,
      nombre: item.sistema
    }))
  );

  const user: User = {
    idUsuario: data[0].idUsuario,
    username: data[0].username,
    primerNombre: data[0].primerNombre,
    apellidoPaterno: data[0].apellidoPaterno,
    correoElectronico: data[0].correoElectronico,
    fechaCreacion: data[0].fechaCreacion,
    perfil: {
      idPerfil: data[0].idPerfil,
      rol: data[0].rol
    },
    sistemas: sistemas.map((sistema) => ({
      ...sistema,
      modulos: modulos
        .filter((modulo) => modulo.idModulo === sistema.idSistema)
        .map((modulo) => ({
          ...modulo,
          accesos: accesos.filter(
            (acceso) => acceso.idAcceso === modulo.idModulo
          )
        }))
    }))
  };

  return user;
};
