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

| Parámetro  | Tipo     | Descripción                          |
| :--------- | :------- | :----------------------------------- |
| `username` | `string` | **Requerido**. Nombre de usuario     |
| `password` | `string` | **Requerido**. Contraseña encriptada |

#### Crear usuario (TEMPORAL)

```http
  POST /api/auth
```

| Parámetro  | Tipo     | Descripción                      |
| :--------- | :------- | :------------------------------- |
| `username` | `string` | **Requerido**. Nombre de usuario |
| `password` | `string` | **Requerido**. Contraseña        |

### OTP

#### Validar usuario y OTP, genera token

```http
  GET /api/auth/otp?:idUsuario&:otp
```

| Parámetro   | Tipo     | Descripción                                        |
| :---------- | :------- | :------------------------------------------------- |
| `idUsuario` | `number` | **Requerido**. ID de usuario                       |
| `otp`       | `number` | **Requerido**. Código de verificación de 6 dígitos |

### Token

#### Validar token

```http
  GET /api/auth/token?:token
```

| Parámetro | Tipo     | Descripción          |
| :-------- | :------- | :------------------- |
| `token`   | `string` | **Requerido**. Token |

Por defecto el token dura 5 días

### Usuarios

#### Obtener data del usuario según ID, incluyendo sistemas, módulos y accesos

```http
  GET /api/users/:idUsuario
```

| Parámetro   | Tipo     | Descripción                  |
| :---------- | :------- | :--------------------------- |
| `idUsuario` | `number` | **Requerido**. ID de usuario |

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

| Parámetro | Tipo     | Descripción                                   |
| :-------- | :------- | :-------------------------------------------- |
| `token`   | `number` | **Requerido**. Token de recuperación          |
| `correo`  | `string` | **Requerido**. Correo electrónico del usuario |

#### Crea una instancia de recuperación

```http
  POST /api/recover-password
```

| Parámetro | Tipo     | Descripción                                   |
| :-------- | :------- | :-------------------------------------------- |
| `correo`  | `string` | **Requerido**. Correo electrónico del usuario |

### Cambio de contraseña

#### Verifica que el usuario exista y su contraseña sea válida

```http
  GET /api/change-password?:idUsuario&:password
```

| Parámetro   | Tipo     | Descripción                                                 |
| :---------- | :------- | :---------------------------------------------------------- |
| `idUsuario` | `number` | **Requerido**. ID de usuario                                |
| `password`  | `string` | **Requerido**. Nueva contraseña (sin encriptar) del usuario |

#### Cambia la contraseña del usuario y elimina sus instancias de recuperación

```http
  PUT /api/change-password
```

| Parámetro   | Tipo     | Descripción                                                 |
| :---------- | :------- | :---------------------------------------------------------- |
| `idUsuario` | `number` | **Requerido**. ID de usuario                                |
| `password`  | `string` | **Requerido**. Nueva contraseña (sin encriptar) del usuario |

### Token activos

#### Verifica que el usuario tenga un token activo

```http
  GET /api/active-token?:idUsuario&:token
```

| Parámetro   | Tipo     | Descripción                  |
| :---------- | :------- | :--------------------------- |
| `idUsuario` | `number` | **Requerido**. ID de usuario |
| `token`     | `string` | **Requerido**. Token activo  |

#### Crea un token activo expirable para el usuario

```http
  POST /api/active-token
```

| Parámetro   | Tipo     | Descripción                  |
| :---------- | :------- | :--------------------------- |
| `idUsuario` | `number` | **Requerido**. ID de usuario |

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

| Parámetro  | Tipo     | Descripción                            |
| :--------- | :------- | :------------------------------------- |
| `nombre`   | `string` | **Requerido**. Nombre del sistema      |
| `url`      | `string` | **Requerido**. URL del sistema         |
| `imageUrl` | `string` | **Requerido**. URL de logo del sistema |

#### Editar un sistema

```http
  PUT /api/admin/systems
```

| Parámetro   | Tipo     | Descripción                            |
| :---------- | :------- | :------------------------------------- |
| `idSistema` | `number` | **Requerido**. ID del sistema          |
| `nombre`    | `string` | **Requerido**. Nombre del sistema      |
| `url`       | `string` | **Requerido**. URL del sistema         |
| `imageUrl`  | `string` | **Requerido**. URL de logo del sistema |

#### Eliminar un sistema

```http
  DELETE /api/admin/systems/:idSistema
```

| Parámetro   | Tipo     | Descripción                   |
| :---------- | :------- | :---------------------------- |
| `idSistema` | `number` | **Requerido**. ID del sistema |

### Admin - Módulos

#### Crear un módulo

```http
  POST /api/admin/modules
```

| Parámetro | Tipo     | Descripción                      |
| :-------- | :------- | :------------------------------- |
| `nombre`  | `string` | **Requerido**. Nombre del módulo |

#### Editar un módulo

```http
  PUT /api/admin/modules
```

| Parámetro  | Tipo     | Descripción                      |
| :--------- | :------- | :------------------------------- |
| `idModulo` | `number` | **Requerido**. ID del módulo     |
| `nombre`   | `string` | **Requerido**. Nombre del módulo |

#### Eliminar un módulo

```http
  DELETE /api/admin/modules/:idModulo
```

| Parámetro  | Tipo     | Descripción                   |
| :--------- | :------- | :---------------------------- |
| `idModulo` | `number` | **Requerido**. ID del sistema |

### Admin - Permisos

#### Obtener los permisos por perfil

```http
  GET /api/admin/permissions/:idPerfil
```

| Parámetro  | Tipo     | Descripción                  |
| :--------- | :------- | :--------------------------- |
| `idPerfil` | `number` | **Requerido**. ID del perfil |

#### Asignar permisos a un perfil

```http
  POST /api/admin/permissions
```

| Parámetro     | Tipo                                                                            | Descripción                  |
| :------------ | :------------------------------------------------------------------------------ | :--------------------------- |
| `idPerfil`    | `number`                                                                        | ID del perfil                |
| `permissions` | `{ idPerfil: number; idSistema: number; idModulo: number; idAcceso: number }[]` | **Requerido**. ID del perfil |

### Admin - Perfiles

#### Crea un perfil

```http
  POST /api/admin/profiles
```

| Parámetro | Tipo     | Descripción                   |
| :-------- | :------- | :---------------------------- |
| `rol`     | `string` | **Requerido**. Rol del perfil |

#### Editar un perfil

```http
  PUT /api/admin/profiles
```

| Parámetro  | Tipo     | Descripción                   |
| :--------- | :------- | :---------------------------- |
| `idPerfil` | `number` | **Requerido**. ID del perfil  |
| `rol`      | `string` | **Requerido**. Rol del perfil |

#### Eliminar un perfil

```http
  DELETE /api/admin/profiles/:idPerfil
```

| Parámetro  | Tipo     | Descripción                  |
| :--------- | :------- | :--------------------------- |
| `idPerfil` | `number` | **Requerido**. ID del perfil |

### Admin - Usuarios

#### Obtener datos de un usuario por RUT

```http
  GET /api/admin/users/:rut
```

| Parámetro | Tipo     | Descripción                    |
| :-------- | :------- | :----------------------------- |
| `rut`     | `string` | **Requerido**. RUT del usuario |

#### Crea un usuario

```http
  POST /api/admin/users
```

| Parámetro           | Tipo     | Descripción                                 |
| :------------------ | :------- | :------------------------------------------ |
| `rut`               | `string` | **Requerido**. RUT del usuario              |
| `primerNombre`      | `string` | **Requerido**. Primer nombre del usuario    |
| `segundoNombre`     | `string` | Segundo nombre del usuario                  |
| `apellidoPaterno`   | `string` | **Requerido**. Apellido paterno del usuario |
| `apellidoMaterno`   | `string` | Apellido materno del usuario                |
| `correoElectronico` | `string` | **Requerido**. Correo del usuario           |
| `idZona`            | `number` | ID de zona del usuario                      |
| `idPerfil`          | `number` | **Requerido**. ID de perfil del usuario     |

#### Edita un usuario

```http
  PUT /api/admin/users
```

| Parámetro           | Tipo     | Descripción                             |
| :------------------ | :------- | :-------------------------------------- |
| `idUsuario`         | `number` | **Requerido**. ID del usuario           |
| `usuario`           | `string` | **Requerido**. Usuario del usuario      |
| `correoElectronico` | `string` | **Requerido**. Correo del usuario       |
| `telefono`          | `string` | Teléfono del usuario                    |
| `direccion`         | `string` | Dirección del usuario                   |
| `idZona`            | `number` | ID de zona del usuario                  |
| `idPerfil`          | `number` | **Requerido**. ID de perfil del usuario |

#### Habilita un usuario inactivo

```http
  PUT /api/admin/users/:idUsuario/activate
```

| Parámetro   | Tipo     | Descripción                   |
| :---------- | :------- | :---------------------------- |
| `idUsuario` | `number` | **Requerido**. ID del usuario |

#### Deshabilita un usuario activo

```http
  DELETE /api/admin/users/:idUsuario
```

| Parámetro   | Tipo     | Descripción                   |
| :---------- | :------- | :---------------------------- |
| `idUsuario` | `number` | **Requerido**. ID del usuario |
