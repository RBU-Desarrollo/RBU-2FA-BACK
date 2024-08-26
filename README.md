# 2FA - Backend

API para el sistema de 2FA, construída con Node, Typescript y Express

## Stack de tecnologías

**Server:** Node, Express, Typescript

## Variables de entorno

Para correr el proyecto, necesitarás de las siguientes variables de entorno en el archivo `.env`

`PORT`

`DB_USER`
`DB_PASSWORD`
`DB_SERVER`
`DB_DATABASE`

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
