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

  if (request.recordsets.length === 0) return null;

  const userData = formatObjectToCamelCase(request.recordsets[0][0]);
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

  const user: User = {
    idUsuario: userData.idUsuario,
    usuario: userData.usuario,
    rut: userData.rut,
    primerNombre: userData.primerNombre,
    apellidoPaterno: userData.apellidoPaterno,
    correoElectronico: userData.correoElectronico,
    perfil: {
      idPerfil: userData.idPerfil,
      rol: userData.rol
    },
    fechaCreacion: userData.fechaCreacion,
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
