export type Perfil = {
  idPerfil: number;
  rol: string;
};

export type Zona = {
  idZona?: number;
  nombre?: string;
  abreviado?: string;
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
  segundoNombre: string | null;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  correoElectronico: string | null;
  correoPersonal: string | null;
  telefono: string | null;
  direccion: string | null;
  fechaCreacion: string;
  fechaNuevaPassword: string;
  perfil: Perfil;
  zona: Zona;
  sistemas: Sistema[];
};
