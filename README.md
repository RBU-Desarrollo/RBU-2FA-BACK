# 2FA - Backend

API para el sistema de 2FA, construída con Node, Typescript y Express

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

## Estructura de rutas

Para un mejor entendimiento y comprensión de las rutas se estableció el siguiente sistema:

Si una ruta es `/api/auth` y otra es `/api/auth/otp`, se estructura los controladores y rutas de la siguiente manera:

```bash
  * controllers
    * auth
      * otp
        * controller.ts (otp controller)
      * controller.ts (auth controller)
```

```bash
  * routes
    * auth.ts
    * otp.ts
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
  GET /api/auth
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
