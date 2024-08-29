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

  const sistemas: Sistema[] = removeDuplicateObjects(
    data.map((item: any) => ({
      idSistema: item.idSistema,
      nombre: item.sistema,
      url: item.url,
      imageUrl: item.imageUrl
    }))
  );

  const modulos: Modulo[] = removeDuplicateObjects(
    data.map((item: any) => ({
      idSistema: item.idSistema,
      idModulo: item.idModulo,
      nombre: item.modulo
    }))
  );

  const accesos: Acceso[] = data.map((item: any) => ({
    idModulo: item.idModulo,
    idAcceso: item.idAcceso,
    nombre: item.acceso
  }));

  const user: User = {
    idUsuario: data[0].idUsuario,
    usuario: data[0].usuario,
    primerNombre: data[0].primerNombre,
    apellidoPaterno: data[0].apellidoPaterno,
    correoElectronico: data[0].correoElectronico,
    perfil: {
      idPerfil: data[0].idPerfil,
      rol: data[0].rol
    },
    fechaCreacion: data[0].fechaCreacion,
    sistemas: sistemas.map((sistema: Sistema) => ({
      ...sistema,
      modulos: modulos
        .filter((modulo: Modulo) => modulo.idSistema === sistema.idSistema)
        .map((modulo: Modulo) => {
          const { idSistema, ...restModulo } = modulo;
          return {
            ...restModulo,
            accesos: accesos
              .filter((acceso: Acceso) => acceso.idModulo === modulo.idModulo)
              .map((acceso: Acceso) => {
                const { idModulo, ...restAcceso } = acceso;
                return restAcceso;
              })
          };
        })
    }))
  };

  return user;
};
