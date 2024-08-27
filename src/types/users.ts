export type Perfil = {
  idPerfil: number;
  rol: string;
};

export type Acceso = {
  idAcceso: number;
  nombre: string;
};

export type Modulo = {
  idModulo: number;
  nombre: string;
  accesos: Acceso[];
};

export type Sistema = {
  idSistema: number;
  nombre: string;
  url: string;
  imageUrl: string;
  modulos: Modulo[];
};

export type User = {
  idUsuario: number;
  username: string;
  primerNombre: string;
  apellidoPaterno: string;
  correoElectronico: string;
  fechaCreacion: string;
  perfil: Perfil;
  sistemas: Sistema[];
};