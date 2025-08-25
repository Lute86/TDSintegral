# **Backend con Auth**

Una API simple, con soporte para autenticación, autorización y operaciones CRUD. La aplicación está diseñada para funcionar con **SQLite** o **MongoDB**, según la configuración.

---

## **📋 Características**

- **Autenticación y Autorización**: Uso de JWT para proteger rutas sensibles.
- **Gestión de Usuarios**: Operaciones CRUD (Crear, Leer, Actualizar, Eliminar).
- **Validación de Datos**: Validación de entradas con `express-validator`.
- **Soporte Multi-Base de Datos**: Configurable para usar **SQLite** o **MongoDB**.
- **Logging y Manejo de Errores**: Middlewares para registrar solicitudes y manejar errores de forma centralizada.

---

## **🛠 Tecnologías Utilizadas**

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express**: Framework para construir la API.
- **Sequelize**: ORM para SQLite.
- **Mongoose**: ODM para MongoDB.
- **Bcrypt**: Encriptación de contraseñas.
- **JWT**: Generación de tokens de autenticación.
- **express-validator**: Validación de datos de entrada.
- **Dotenv**: Manejo de variables de entorno.

---

## **📦 Requisitos Previos**

Asegúrate de tener instalado lo siguiente en tu sistema:

- [Node.js](https://nodejs.org/) (versión lts).
- [Git](https://git-scm.com/).
- **Base de datos**:
  - **SQLite**: No requiere instalación adicional (se crea automáticamente).
  - **MongoDB**: Instalar [MongoDB Community Server](https://www.mongodb.com/try/download/community) o usar un servicio en la nube como [MongoDB Atlas](https://www.mongodb.com/atlas/database).

---

## **🚀 Instalación y Configuración**

### **1. Clonar el repositorio**

```bash
git clone https://github.com/Lute86/TDSintegral
cd TDSintegral
```

### **2. Instalar dependencias**

Ejecuta el siguiente comando para instalar todas las dependencias del proyecto:

```bash
npm install
```

---

### **3. Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables según tu entorno:

```env
# Puerto del servidor
PORT=3000

# Configuración de la base de datos
DB_CLIENT=sqlite
#DB_CLIENT=mongo  # Opciones: "sqlite" o "mongo". Elegir cual utilizar y dejar comentada la otra
MONGO_URI=mongodb://localhost:27017/user_management  # Solo si usas MongoDB
DB_STORAGE=./dev.sqlite  # Ruta del archivo SQLite (solo para SQLite)

# Clave secreta para JWT
SESSION_SECRET=tu_clave_secreta
```

---

### **4. Inicializar y poblar la base de datos**

#### **Para SQLite**:
No requiere configuración adicional. El archivo de la base de datos se creará automáticamente al iniciar el servidor.

#### **Para MongoDB**:
Asegúrate de que el servicio de MongoDB esté en ejecución. Si usas **MongoDB Atlas**, reemplaza `MONGO_URI` con tu cadena de conexión.

Ejecuta el siguiente comando para crear usuarios iniciales:

```bash
npm run seed
```

Esto creará los siguientes usuarios:

| Email               | Contraseña         | Rol    |
|---------------------|--------------------|--------|
| `admin@example.com` | `adminPassword123` | Admin  |
| `user@example.com`  | `userPassword123`  | User   |
---

## **🏃 Ejecutar la aplicación**

### **Modo desarrollo**

```bash
npm run dev
```

Esto iniciará el servidor con **Nodemon**, que reinicia automáticamente la aplicación al detectar cambios en el código.

---

### **Modo producción**

```bash
npm start
```

El servidor se iniciará en el puerto especificado en `.env` (por defecto: `3000`).

---

## **📡 Endpoints de la API**

### **Autenticación**

| Método | Endpoint          | Descripción                     |
|--------|-------------------|---------------------------------|
| POST   | `/auth/login`     | Iniciar sesión y obtener token.|
| POST   | `/auth/register`  | Registrar un nuevo usuario.     |
| GET    | `/auth/token`     | Validar token JWT.              |

---

### **Usuarios**

| Método | Endpoint               | Descripción                     |
|--------|------------------------|---------------------------------|
| GET    | `/user/profile/:userId`| Obtener perfil de usuario.     |
| PUT    | `/user/:userId`        | Actualizar usuario.             |
| DELETE | `/user/:userId`        | Eliminar usuario.               |

---

### **Administración**

| Método | Endpoint          | Descripción                     |
|--------|-------------------|---------------------------------|
| GET    | `/admin/users`    | Listar todos los usuarios.     |
| PUT    | `/admin/recover/:userId` | Recuperar usuario eliminado. |

---

## **🔧 Configuración Adicional**

### **Variables de Entorno Recomendadas para Producción**

```env
NODE_ENV=production
JWT_SECRET=una_clave_muy_secreta_y_compleja
DB_CLIENT=mongo  # o "sqlite" según prefieras
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/db_name?retryWrites=true&w=majority
```

---

### **Ejemplo de Solicitud con Postman**

#### **Login de Usuario**
- **Método**: `POST`
- **URL**: `http://localhost:3000/auth/login`
- **Body (JSON)**:
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }
  ```

#### **Respuesta Exitosa**:
```json
{
  "user": {
    "id": 1,
    "nombre": "Juan",
    "email": "usuario@ejemplo.com",
    "role": "User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## **📂 Estructura del Proyecto**

```
TDSintegral/
├── .env                  # Variables de entorno
├── package.json          # Dependencias y scripts
├── app.js                # Configuración principal de Express
├── config/               # Configuración de bases de datos
│   ├── mongo.config.js
│   └── sqlite.config.js
├── seeder/               # Scripts para poblar la base de datos
├── controllers/          # Lógica de los controladores
├── middleware/           # Middlewares (autenticación, validación, etc.)
├── models/               # Modelos de base de datos
├── providers/            # Proveedores de datos (SQLite/MongoDB)
├── routes/               # Definición de rutas
├── services/             # Lógica de negocio
└── handlers/             # Manejadores de respuestas y errores
```