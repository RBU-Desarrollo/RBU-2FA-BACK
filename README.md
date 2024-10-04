# 2FA - Backend

API para el sistema de 2FA, construída con Node, Typescript y Express

## Índice

- [2FA - Backend](#2fa---backend)
  - [Índice](#índice)
  - [Stack de tecnologías](#stack-de-tecnologías)
  - [Variables de entorno](#variables-de-entorno)
  - [Instalación y ejecución](#instalación-y-ejecución)
  - [Compilación para producción](#compilación-para-producción)
  - [Estructura de rutas](#estructura-de-rutas)
  - [Rutas de API](#rutas-de-api)
    - [Probar conexión](#probar-conexión)
      - [Probar conexión a la base de datos](#probar-conexión-a-la-base-de-datos)
    - [Auth](#auth)
      - [Iniciar sesión (usuario y contraseña)](#iniciar-sesión-usuario-y-contraseña)
      - [Crear usuario (TEMPORAL)](#crear-usuario-temporal)
    - [OTP](#otp)
      - [Validar usuario y OTP, genera token](#validar-usuario-y-otp-genera-token)
    - [Token](#token)
      - [Validar token](#validar-token)
    - [Usuarios](#usuarios)
      - [Obtener data del usuario según ID, incluyendo sistemas, módulos y accesos](#obtener-data-del-usuario-según-id-incluyendo-sistemas-módulos-y-accesos)
    - [Sistemas](#sistemas)
      - [Obtener todos los sistemas](#obtener-todos-los-sistemas)
    - [Recuperación de contraseña](#recuperación-de-contraseña)
      - [Verificar que el usuario haya solicitado la recuperación](#verificar-que-el-usuario-haya-solicitado-la-recuperación)
      - [Crea una instancia de recuperación](#crea-una-instancia-de-recuperación)
    - [Cambio de contraseña](#cambio-de-contraseña)
      - [Verifica que el usuario exista y su contraseña sea válida](#verifica-que-el-usuario-exista-y-su-contraseña-sea-válida)
      - [Cambia la contraseña del usuario y elimina sus instancias de recuperación](#cambia-la-contraseña-del-usuario-y-elimina-sus-instancias-de-recuperación)
    - [Token activos](#token-activos)
      - [Verifica que el usuario tenga un token activo](#verifica-que-el-usuario-tenga-un-token-activo)
      - [Crea un token activo expirable para el usuario](#crea-un-token-activo-expirable-para-el-usuario)
    - [Admin](#admin)
      - [Obtener contenido para administrador (sistemas, perfiles, usuarios, módulos, accesos y zonas)](#obtener-contenido-para-administrador-sistemas-perfiles-usuarios-módulos-accesos-y-zonas)
    - [Admin - Sistemas](#admin---sistemas)
      - [Crear un sistema](#crear-un-sistema)
      - [Editar un sistema](#editar-un-sistema)
      - [Eliminar un sistema](#eliminar-un-sistema)
    - [Admin - Módulos](#admin---módulos)
      - [Crear un módulo](#crear-un-módulo)
      - [Editar un módulo](#editar-un-módulo)
      - [Eliminar un módulo](#eliminar-un-módulo)
    - [Admin - Permisos](#admin---permisos)
      - [Obtener los permisos por perfil](#obtener-los-permisos-por-perfil)
      - [Asignar permisos a un perfil](#asignar-permisos-a-un-perfil)
    - [Admin - Perfiles](#admin---perfiles)
      - [Crea un perfil](#crea-un-perfil)
      - [Editar un perfil](#editar-un-perfil)
      - [Eliminar un perfil](#eliminar-un-perfil)
    - [Admin - Usuarios](#admin---usuarios)
      - [Obtener datos de un usuario por RUT](#obtener-datos-de-un-usuario-por-rut)
      - [Crea un usuario](#crea-un-usuario)
      - [Edita un usuario](#edita-un-usuario)
      - [Habilita un usuario inactivo](#habilita-un-usuario-inactivo)
      - [Deshabilita un usuario activo](#deshabilita-un-usuario-activo)

## Stack de tecnologías

**Server:** Node, Express, Typescript

## Variables de entorno

Para correr el proyecto, necesitarás de las siguientes variables de entorno en el archivo `.env`

`PORT`

`EMAIL_API_ENDPOINT`

`DB_USER`
`DB_PASSWORD`
`DB_SERVER`
`DB_DATABASE`
`DB_PORT`

`JWT_SECRET`

## Instalación y ejecución

Instala los módulos del proyecto con `pnpm`

```bash
  cd my-project
  pnpm install
```

Una vez rellenadas las variables de entorno, ejecuta

```bash
  pnpm dev
```

## Compilación para producción

Verificar las variables de entorno dentro de `.env.production`

Compila la build de producción en la consola

```bash
  pnpm build
```

Se crearán 2 directorios: `build` y `dist`

`build` es el compilado de Typescript a Javascript (ES6)

`dist` es el compilado de Javascript (ES6) a Javascript (CommonJS)

Utilizar el que mejor corresponda según la configuración del servidor

## Estructura de rutas

Para un mejor entendimiento y comprensión de las rutas se estableció el siguiente sistema:

Si una ruta es `/api/auth` y otra es `/api/auth/otp`, se estructura los controladores y rutas de la siguiente manera:

```bash
  * controllers
    * auth
      * otp
        * controller.ts (otp controller)
      * token
        * controller.ts (token controller)
      * controller.ts (auth controller)
```

```bash
  * routes
    * auth.ts
    * otp.ts
    * token.ts
```

## Rutas de API

### Probar conexión

#### Probar conexión a la base de datos

```http
  GET /api/test-connection
```

### Auth

#### Iniciar sesión (usuario y contraseña)

```http
  GET /api/auth?:username&:password
```

| Parameter  | Type     | Description                         |
| :--------- | :------- | :---------------------------------- |
| `username` | `string` | **Required**. Nombre de usuario     |
| `password` | `string` | **Required**. Contraseña encriptada |

#### Crear usuario (TEMPORAL)

```http
  POST /api/auth
```

| Parameter  | Type     | Description                     |
| :--------- | :------- | :------------------------------ |
| `username` | `string` | **Required**. Nombre de usuario |
| `password` | `string` | **Required**. Contraseña        |

### OTP

#### Validar usuario y OTP, genera token

```http
  GET /api/auth/otp?:idUsuario&:otp
```

| Parameter   | Type     | Description                                       |
| :---------- | :------- | :------------------------------------------------ |
| `idUsuario` | `number` | **Required**. ID de usuario                       |
| `otp`       | `number` | **Required**. Código de verificación de 6 dígitos |

### Token

#### Validar token

```http
  GET /api/auth/token?:token
```

| Parameter | Type     | Description         |
| :-------- | :------- | :------------------ |
| `token`   | `string` | **Required**. Token |

Por defecto el token dura 5 días

### Usuarios

#### Obtener data del usuario según ID, incluyendo sistemas, módulos y accesos

```http
  GET /api/users/:idUsuario
```

| Parameter   | Type     | Description                 |
| :---------- | :------- | :-------------------------- |
| `idUsuario` | `number` | **Required**. ID de usuario |

### Sistemas

#### Obtener todos los sistemas

```http
  GET /api/systems
```

### Recuperación de contraseña

#### Verificar que el usuario haya solicitado la recuperación

```http
  GET /api/recover-password?:token&:correo
```

| Parameter | Type     | Description                                  |
| :-------- | :------- | :------------------------------------------- |
| `token`   | `number` | **Required**. Token de recuperación          |
| `correo`  | `string` | **Required**. Correo electrónico del usuario |

#### Crea una instancia de recuperación

```http
  POST /api/recover-password
```

| Parameter | Type     | Description                                  |
| :-------- | :------- | :------------------------------------------- |
| `correo`  | `string` | **Required**. Correo electrónico del usuario |

### Cambio de contraseña

#### Verifica que el usuario exista y su contraseña sea válida

```http
  GET /api/change-password?:idUsuario&:password
```

| Parameter   | Type     | Description                                                |
| :---------- | :------- | :--------------------------------------------------------- |
| `idUsuario` | `number` | **Required**. ID de usuario                                |
| `password`  | `string` | **Required**. Nueva contraseña (sin encriptar) del usuario |

#### Cambia la contraseña del usuario y elimina sus instancias de recuperación

```http
  PUT /api/change-password
```

| Parameter   | Type     | Description                                                |
| :---------- | :------- | :--------------------------------------------------------- |
| `idUsuario` | `number` | **Required**. ID de usuario                                |
| `password`  | `string` | **Required**. Nueva contraseña (sin encriptar) del usuario |

### Token activos

#### Verifica que el usuario tenga un token activo

```http
  GET /api/active-token?:idUsuario&:token
```

| Parameter   | Type     | Description                 |
| :---------- | :------- | :-------------------------- |
| `idUsuario` | `number` | **Required**. ID de usuario |
| `token`     | `string` | **Required**. Token activo  |

#### Crea un token activo expirable para el usuario

```http
  POST /api/active-token
```

| Parameter   | Type     | Description                 |
| :---------- | :------- | :-------------------------- |
| `idUsuario` | `number` | **Required**. ID de usuario |

### Admin

#### Obtener contenido para administrador (sistemas, perfiles, usuarios, módulos, accesos y zonas)

```http
  GET /api/admin
```

### Admin - Sistemas

#### Crear un sistema

```http
  POST /api/admin/systems
```

| Parameter  | Type     | Description                           |
| :--------- | :------- | :------------------------------------ |
| `nombre`   | `string` | **Required**. Nombre del sistema      |
| `url`      | `string` | **Required**. URL del sistema         |
| `imageUrl` | `string` | **Required**. URL de logo del sistema |

#### Editar un sistema

```http
  PUT /api/admin/systems
```

| Parameter   | Type     | Description                           |
| :---------- | :------- | :------------------------------------ |
| `idSistema` | `number` | **Required**. ID del sistema          |
| `nombre`    | `string` | **Required**. Nombre del sistema      |
| `url`       | `string` | **Required**. URL del sistema         |
| `imageUrl`  | `string` | **Required**. URL de logo del sistema |

#### Eliminar un sistema

```http
  DELETE /api/admin/systems/:idSistema
```

| Parameter   | Type     | Description                  |
| :---------- | :------- | :--------------------------- |
| `idSistema` | `number` | **Required**. ID del sistema |

### Admin - Módulos

#### Crear un módulo

```http
  POST /api/admin/modules
```

| Parameter | Type     | Description                     |
| :-------- | :------- | :------------------------------ |
| `nombre`  | `string` | **Required**. Nombre del módulo |

#### Editar un módulo

```http
  PUT /api/admin/modules
```

| Parameter  | Type     | Description                     |
| :--------- | :------- | :------------------------------ |
| `idModulo` | `number` | **Required**. ID del módulo     |
| `nombre`   | `string` | **Required**. Nombre del módulo |

#### Eliminar un módulo

```http
  DELETE /api/admin/modules/:idModulo
```

| Parameter  | Type     | Description                  |
| :--------- | :------- | :--------------------------- |
| `idModulo` | `number` | **Required**. ID del sistema |

### Admin - Permisos

#### Obtener los permisos por perfil

```http
  GET /api/admin/permissions/:idPerfil
```

| Parameter  | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `idPerfil` | `number` | **Required**. ID del perfil |

#### Asignar permisos a un perfil

```http
  POST /api/admin/permissions
```

| Parameter     | Type                                                                            | Description                 |
| :------------ | :------------------------------------------------------------------------------ | :-------------------------- |
| `idPerfil`    | `number`                                                                        | ID del perfil               |
| `permissions` | `{ idPerfil: number; idSistema: number; idModulo: number; idAcceso: number }[]` | **Required**. ID del perfil |

### Admin - Perfiles

#### Crea un perfil

```http
  POST /api/admin/profiles
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :--------------------------- |
| `rol`     | `string` | **Required**. Rol del perfil |

#### Editar un perfil

```http
  PUT /api/admin/profiles
```

| Parameter  | Type     | Description                  |
| :--------- | :------- | :--------------------------- |
| `idPerfil` | `number` | **Required**. ID del perfil  |
| `rol`      | `string` | **Required**. Rol del perfil |

#### Eliminar un perfil

```http
  DELETE /api/admin/profiles/:idPerfil
```

| Parameter  | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `idPerfil` | `number` | **Required**. ID del perfil |

### Admin - Usuarios

#### Obtener datos de un usuario por RUT

```http
  GET /api/admin/users/:rut
```

| Parameter | Type     | Description                   |
| :-------- | :------- | :---------------------------- |
| `rut`     | `string` | **Required**. RUT del usuario |

#### Crea un usuario

```http
  POST /api/admin/users
```

| Parameter           | Type     | Description                                |
| :------------------ | :------- | :----------------------------------------- |
| `rut`               | `string` | **Required**. RUT del usuario              |
| `primerNombre`      | `string` | **Required**. Primer nombre del usuario    |
| `segundoNombre`     | `string` | Segundo nombre del usuario                 |
| `apellidoPaterno`   | `string` | **Required**. Apellido paterno del usuario |
| `apellidoMaterno`   | `string` | Apellido materno del usuario               |
| `correoElectronico` | `string` | **Required**. Correo del usuario           |
| `idZona`            | `number` | ID de zona del usuario                     |
| `idPerfil`          | `number` | **Required**. ID de perfil del usuario     |

#### Edita un usuario

```http
  PUT /api/admin/users
```

| Parameter           | Type     | Description                            |
| :------------------ | :------- | :------------------------------------- |
| `idUsuario`         | `number` | **Required**. ID del usuario           |
| `usuario`           | `string` | **Required**. Usuario del usuario      |
| `correoElectronico` | `string` | **Required**. Correo del usuario       |
| `telefono`          | `string` | Teléfono del usuario                   |
| `direccion`         | `string` | Dirección del usuario                  |
| `idZona`            | `number` | ID de zona del usuario                 |
| `idPerfil`          | `number` | **Required**. ID de perfil del usuario |

#### Habilita un usuario inactivo

```http
  PUT /api/admin/users/:idUsuario/activate
```

| Parameter   | Type     | Description                  |
| :---------- | :------- | :--------------------------- |
| `idUsuario` | `number` | **Required**. ID del usuario |

#### Deshabilita un usuario activo

```http
  DELETE /api/admin/users/:idUsuario
```

| Parameter   | Type     | Description                  |
| :---------- | :------- | :--------------------------- |
| `idUsuario` | `number` | **Required**. ID del usuario |
