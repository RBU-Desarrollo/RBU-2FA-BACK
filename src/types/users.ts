export type Perfil = {
  idPerfil: number;
  rol: string;
};

export type Acceso = {
  idSistema?: number;
  idModulo?: number;
  idAcceso: number;
  nombre: string;
};

export type Modulo = {
  idSistema?: number;
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
  usuario: string;
  rut: string;
  primerNombre: string;
  apellidoPaterno: string;
  correoElectronico: string;
  fechaCreacion: string;
  perfil: Perfil;
  sistemas: Sistema[];
};
