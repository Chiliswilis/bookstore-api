# 📚 Bookstore API — API REST con Arquitectura MVC

API REST para la gestión de una librería, desarrollada con **Node.js**, **Express** y **PostgreSQL**, bajo el patrón **Modelo-Vista-Controlador (MVC)** complementado con una **capa de servicios**. Incluye autenticación con **JWT**, autorización por **roles (RBAC)**, paginación y búsqueda de libros, y manejo centralizado de errores.

---

## 👤 Información del proyecto

| Dato | Detalle |
|---|---|
| **Alumno** | Williams Alejandro Díaz Gómez |
| **Docente** | Omar Gerardo Pérez Morales |
| **Materia** | Desarrollo de Backend con Frameworks Modernos |
| **Carrera** | Ingeniería en Sistemas Computacionales |
| **Institución** | Tecnológico Superior de Jalisco — Campus La Huerta |
| **Actividad** | Proyecto — Creación de una API REST Full |

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| **Node.js** | Entorno de ejecución |
| **Express** | Framework para la API REST |
| **PostgreSQL** | Base de datos relacional |
| **Sequelize** | ORM: modelos, relaciones y consultas |
| **JWT (jsonwebtoken)** | Autenticación mediante tokens |
| **bcryptjs** | Hash de contraseñas |
| **dotenv** | Variables de entorno |
| **CORS** | Solicitudes entre orígenes |
| **nodemon** | Reinicio automático en desarrollo |
| **Postman** | Pruebas de los endpoints |

---

## 📂 Estructura del proyecto

```text
bookstore-api/
├── src/
│   ├── config/
│   │   └── database.js            # Conexión de Sequelize a PostgreSQL
│   ├── controllers/               # Reciben la petición y devuelven la respuesta
│   │   ├── auth.controller.js
│   │   └── book.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js     # verifyToken (JWT) y checkRole (RBAC)
│   │   └── error.middleware.js    # Manejo centralizado de errores
│   ├── models/                    # Modelos y relaciones (Sequelize)
│   │   ├── index.js
│   │   ├── user.model.js
│   │   ├── book.model.js
│   │   └── category.model.js
│   ├── routes/                    # Definición de endpoints
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   └── book.routes.js
│   ├── seeders/
│   │   └── initSeeder.js          # Datos iniciales de prueba
│   ├── services/                  # Lógica de negocio
│   │   ├── auth.service.js
│   │   └── book.service.js
│   └── app.js                     # Configuración de Express
├── .env.example                   # Plantilla de variables de entorno
├── .gitignore
├── package.json
└── server.js                      # Punto de entrada
```

**Flujo de una petición:** `Ruta → Middlewares → Controlador → Servicio → Modelo → PostgreSQL`

---

## ⚙️ Instalación y ejecución

### Requisitos previos

- [Node.js](https://nodejs.org/) v16 o superior
- [PostgreSQL](https://www.postgresql.org/) en ejecución (local o remoto)
- [Postman](https://www.postman.com/) (opcional, para probar la API)

### Pasos

**1. Clonar el repositorio e instalar dependencias**

```bash
git clone https://github.com/<TU_USUARIO>/bookstore-api.git
cd bookstore-api
npm install
```

**2. Crear la base de datos**

Desde pgAdmin o `psql`, crear una base de datos vacía llamada `bookstore_db`:

```sql
CREATE DATABASE bookstore_db;
```

Las tablas **no** se crean manualmente: Sequelize las genera al iniciar el servidor.

**3. Configurar las variables de entorno**

Copiar la plantilla y completar los valores:

```bash
cp .env.example .env
```

(En Windows PowerShell: `Copy-Item .env.example .env`)

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=TU_CONTRASENA_DE_POSTGRES
DB_NAME=bookstore_db
JWT_SECRET=UNA_CLAVE_SECRETA_LARGA_Y_COMPLEJA
JWT_EXPIRES_IN=24h
```

> ⚠️ El archivo `.env` contiene datos sensibles y **no se sube al repositorio** (está en `.gitignore`).

**4. Cargar los datos iniciales (seeder)**

```bash
npm run seed
```

Crea dos usuarios, una categoría y dos libros de prueba. Es seguro ejecutarlo varias veces: no duplica ni borra datos.

**5. Iniciar el servidor**

```bash
npm run dev      # desarrollo (nodemon)
# o
npm start        # producción
```

La API quedará disponible en `http://localhost:3000/api/v1`.

### Scripts disponibles

| Script | Comando | Descripción |
|---|---|---|
| `npm start` | `node server.js` | Inicia el servidor |
| `npm run dev` | `nodemon server.js` | Inicia con recarga automática |
| `npm run seed` | `node src/seeders/initSeeder.js` | Carga los datos iniciales |

---

## 👥 Usuarios de prueba (creados por el seeder)

| Rol | Correo | Contraseña |
|---|---|---|
| `ADMIN` | `admin@bookstore.com` | `AdminPassword123!` |
| `CLIENT` | `estudiante@isc.edu.mx` | `ClientePassword123!` |

---

## 🌐 Endpoints

Prefijo base: **`/api/v1`**

### Autenticación

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| `POST` | `/auth/register` | Registrar un usuario (siempre con rol `CLIENT`) | Público |
| `POST` | `/auth/login` | Iniciar sesión y obtener el token JWT | Público |

### Libros

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| `GET` | `/books` | Listar libros (con paginación y búsqueda) | Público |
| `GET` | `/books/:id` | Consultar un libro por ID | Público |
| `POST` | `/books` | Crear un libro | 🔒 Solo `ADMIN` |
| `PUT` | `/books/:id` | Actualizar un libro | 🔒 Solo `ADMIN` |
| `DELETE` | `/books/:id` | Eliminar un libro | 🔒 Solo `ADMIN` |

### Parámetros de `GET /books`

| Parámetro | Descripción | Por defecto |
|---|---|---|
| `page` | Número de página | `1` |
| `limit` | Libros por página | `10` |
| `search` | Búsqueda por título o autor (sin distinguir mayúsculas) | — |
| `minPrice` | Precio mínimo | — |
| `maxPrice` | Precio máximo | — |

Ejemplo: `GET /api/v1/books?search=clean&minPrice=10&maxPrice=60&page=1&limit=5`

---

## 🔐 Autenticación y autorización

1. El usuario inicia sesión en `POST /api/v1/auth/login` y recibe un token JWT.
2. En las rutas protegidas se envía el token en el encabezado:

```http
Authorization: Bearer <TU_TOKEN>
```

### Ejemplos de uso

**Login**

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@bookstore.com",
  "password": "AdminPassword123!"
}
```

**Crear un libro (requiere token de ADMIN)**

```http
POST /api/v1/books
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json

{
  "title": "Pedro Páramo",
  "author": "Juan Rulfo",
  "isbn": "9786074210138",
  "price": 280,
  "stock": 12
}
```

### Matriz de permisos

| Operación | Público | `CLIENT` | `ADMIN` |
|---|:---:|:---:|:---:|
| Consultar libros (`GET`) | ✅ | ✅ | ✅ |
| Crear libro (`POST`) | ❌ | ❌ | ✅ |
| Actualizar libro (`PUT`) | ❌ | ❌ | ✅ |
| Eliminar libro (`DELETE`) | ❌ | ❌ | ✅ |

La seguridad se verifica en dos niveles: **autenticación** (¿tiene un token válido?) y **autorización** (¿su rol permite la operación?). Un cliente con token válido que intente crear, editar o borrar un libro recibe **403 Forbidden**.

---

## 🧪 Pruebas con Postman

Se realizaron **16 pruebas más una adicional**; todas devolvieron el código esperado.

| # | Prueba | Esperado |
|---|---|:---:|
| 01 | GET Books | 200 |
| 02 | Login Admin | 200 |
| 03 | Login con contraseña incorrecta | 401 |
| 04 | Login con datos faltantes | 400 |
| 05 | Get Book By ID | 200 |
| 06 | Get Book Not Found | 404 |
| 07 | Create Book (admin) | 201 |
| 08 | Update Book (admin) | 200 |
| 09 | Delete Book (admin) | 200 |
| 10 | GET del libro eliminado | 404 |
| 11 | Create Book sin token | 401 |
| 12 | Login Client | 200 |
| 13 | Create Book (cliente) | 403 |
| 14 | Update Book (cliente) | 403 |
| 15 | Delete Book (cliente) | 403 |
| 16 | Endpoint inexistente | 404 |
| 17 | Registro con `role: ADMIN` en el body (queda como `CLIENT`) | 201 |

La documentación completa, con las capturas de cada prueba, está en el reporte incluido en la carpeta [`docs/`](./docs).

### Códigos de respuesta

| Código | Estado | Uso |
|---|---|---|
| `200` | OK | Solicitud procesada correctamente |
| `201` | Created | Recurso creado |
| `400` | Bad Request | Datos incorrectos o incompletos |
| `401` | Unauthorized | Falta el token o las credenciales son inválidas |
| `403` | Forbidden | Token inválido/expirado o rol sin permisos |
| `404` | Not Found | Recurso o ruta inexistente |
| `500` | Internal Server Error | Error interno (el detalle solo se registra en el servidor) |

---

## 🛡️ Decisiones de seguridad y mejoras

- **El registro público no permite elegir el rol:** todo usuario nuevo es `CLIENT`; los administradores se crean con el seeder.
- **Contraseñas con hash** (bcryptjs) mediante un hook del modelo; nunca se guardan en texto plano.
- **Seeder idempotente** (`findOrCreate`): no borra tablas ni duplica registros.
- **Errores centralizados:** los servicios lanzan errores con su código HTTP y un único middleware decide la respuesta. Los errores 500 no exponen detalles.
- **Variables sensibles fuera del código** (`.env` ignorado por Git, con `.env.example` como plantilla).

---

## 📄 Licencia

Proyecto académico desarrollado con fines educativos.