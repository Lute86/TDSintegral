# **Teoría del Proyecto **

---

## **📌 Introducción**
Este documento explica la **arquitectura**, **diseño** y **principios** detrás del backend **Node + Express**, una API RESTful para gestionar usuarios con autenticación, autorización y operaciones CRUD. El proyecto está diseñado para ser **modular**, **escalable** y **fácil de mantener**, utilizando patrones de diseño comunes en el desarrollo de APIs con Node.js.

---

## **🏗 Arquitectura del Proyecto**
La arquitectura del proyecto sigue el patrón **MVC (Model-View-Controller)**, adaptado para APIs RESTful, con capas adicionales para mejorar la **separación de responsabilidades** y la **reutilización de código**. Las capas principales son:

1. **Rutas (Routes)**
2. **Controladores (Controllers)**
3. **Servicios (Services)**
4. **Proveedores (Providers)**
5. **Modelos (Models)**
6. **Middlewares**
7. **Configuración (Config)**

---

## **📂 Estructura de Directorios**
```
user-management-api/
├── config/            # Configuración de bases de datos y variables de entorno
├── controllers/       # Lógica para manejar solicitudes HTTP
├── middleware/        # Funciones intermedias (autenticación, validación, etc.)
├── models/            # Definición de esquemas y modelos de base de datos
├── providers/         # Abstracción de la capa de acceso a datos
├── services/          # Lógica de negocio
├── handlers/          # Manejadores de respuestas y errores
├── routes/            # Definición de rutas de la API
├── seeder/            # Scripts para poblar la base de datos
├── app.js             # Configuración principal de Express
└── package.json       # Dependencias y scripts del proyecto
```

---

## **🧩 Patrones de Diseño Utilizados**

### **1. Separación de Responsabilidades**
Cada capa tiene una responsabilidad clara:
- **Rutas**: Definen los endpoints y los métodos HTTP.
- **Controladores**: Manejan la lógica de las solicitudes y respuestas.
- **Servicios**: Contienen la lógica de negocio.
- **Proveedores**: Abstraen el acceso a la base de datos.
- **Middlewares**: Funciones intermedias para validación, autenticación, etc.

---

### **2. Inyección de Dependencias**
Los módulos se importan y exportan para **reutilizar código** y **facilitar las pruebas**. Por ejemplo:
- Los controladores usan servicios.
- Los servicios usan proveedores.
- Los proveedores interactúan con la base de datos.

---

### **3. Abstracción de la Base de Datos**
El proyecto soporta **múltiples bases de datos** (SQLite y MongoDB) gracias a la capa de **proveedores**, que oculta los detalles de implementación de la base de datos.

---

## **🔧 Capas del Proyecto**

---

### **1. Rutas (`routes/`)**
- **Propósito**: Definir los endpoints de la API y asociarlos con los controladores correspondientes.
- **Ejemplo**:
  ```javascript
  // auth.routes.js
  authRouter.post("/login", validateLogin, authController.validateUser);
  ```
- **Beneficios**:
  - Centraliza la definición de rutas.
  - Facilita el mantenimiento y la escalabilidad.

---

### **2. Controladores (`controllers/`)**
- **Propósito**: Manejar las solicitudes HTTP, validar datos de entrada y delegar la lógica de negocio a los servicios.
- **Ejemplo**:
  ```javascript
  // auth.controller.js
  const validateUser = async (req, res) => {
    const user = await authService.validateUser(req.body);
    const token = createToken(user);
    return HttpResponse.success(res, { user, token });
  };
  ```
- **Beneficios**:
  - Separa la lógica de manejo de solicitudes de la lógica de negocio.
  - Facilita la escritura de pruebas unitarias.

---

### **3. Servicios (`services/`)**
- **Propósito**: Contener la **lógica de negocio** y coordinar las operaciones entre proveedores y controladores.
- **Ejemplo**:
  ```javascript
  // auth.service.js
  const validateUser = async (body) => {
    const user = await UserProvider.findOne({ email: body.email });
    if (!user) return null;
    const isValid = await bcrypt.compare(body.password, user.password);
    return isValid ? user : "PasswordError";
  };
  ```
- **Beneficios**:
  - **Reutilización**: La misma lógica de negocio puede ser usada por múltiples controladores.
  - **Abstracción**: Los controladores no necesitan saber cómo se accede a la base de datos.

---

### **4. Proveedores (`providers/`)**
- **Propósito**: **Abstraer el acceso a la base de datos** para que el resto de la aplicación no dependa de la tecnología específica (Sequelize, Mongoose, etc.).
- **Ejemplo**:
  ```javascript
  // user.provider.js
  UserProvider = {
    create: (data) => User.create(data),
    findById: (id) => User.findByPk(id),
    findOne: (query) => User.findOne({ where: query }),
  };
  ```
- **Beneficios**:
  - **Flexibilidad**: Permite cambiar de base de datos sin modificar los servicios o controladores.
  - **Normalización**: Garantiza que los datos devueltos tengan un formato consistente.

---

### **5. Modelos (`models/`)**
- **Propósito**: Definir la **estructura de los datos** (esquemas) para la base de datos.
- **Ejemplo (Sequelize)**:
  ```javascript
  // user.model.js (SQLite)
  const User = sequelize.define("Users", {
    nombre: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
  });
  ```
- **Ejemplo (Mongoose)**:
  ```javascript
  // user.model.js (MongoDB)
  const userSchema = new mongoose.Schema({
    nombre: String,
    email: { type: String, unique: true },
    password: String,
  });
  ```

---

### **6. Middlewares (`middleware/`)**
- **Propósito**: Funciones que se ejecutan **antes o después** de que una solicitud llegue al controlador. Se usan para:
  - Autenticación (`authenticateToken`).
  - Autorización (`authorizeToken`).
  - Validación de datos (`validateLogin`).
- **Ejemplo**:
  ```javascript
  // auth.mdw.js
  function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return HttpResponse.unauthorized(res);
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    req.user = decoded;
    next();
  }
  ```
- **Beneficios**:
  - **Reutilización**: Middlewares como `authenticateToken` pueden usarse en múltiples rutas.
  - **Seguridad**: Centraliza la lógica de autenticación y autorización.

---

### **7. Manejadores de Respuestas y Errores (`handlers/`)**
- **Propósito**: Estandarizar las **respuestas HTTP** y el **manejo de errores**.
- **Ejemplo**:
  ```javascript
  // HttpResponse.js
  class HttpResponse {
    static success(res, data) {
      return res.status(200).json(data);
    }
    static notFound(res, message) {
      return res.status(404).json(message);
    }
  }
  ```
- **Beneficios**:
  - **Consistencia**: Todas las respuestas siguen el mismo formato.
  - **Mantenimiento**: Cambios en el formato de respuesta se hacen en un solo lugar.

---

### **8. Configuración (`config/`)**
- **Propósito**: Centralizar la configuración de la aplicación, como la conexión a la base de datos.
- **Ejemplo**:
  ```javascript
  // sqlite.config.js
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_STORAGE || "dev.sqlite",
  });
  ```

---

## **🔐 Autenticación y Autorización**
- **JWT (JSON Web Tokens)**: Se usan para autenticar usuarios y proteger rutas.
  - **`authenticateToken`**: Verifica que el token sea válido.
  - **`authorizeToken`**: Verifica que el usuario tenga permisos para acceder a un recurso.
- **Bcrypt**: Se usa para **encriptar contraseñas** antes de guardarlas en la base de datos.

---

## **🗃 Base de Datos**
El proyecto soporta **dos bases de datos**:
1. **SQLite**: Base de datos embebida, ideal para desarrollo y pruebas.
2. **MongoDB**: Base de datos NoSQL, ideal para producción y escalabilidad.

### **Diferencias Clave**
| Característica       | SQLite                          | MongoDB                        |
|----------------------|---------------------------------|--------------------------------|
| **Tipo**             | SQL (relacional)                | NoSQL (documentos)             |
| **Esquema**          | Rígido (tablas y columnas)      | Flexible (colecciones y documentos) |
| **Consultas**        | SQL                             | MongoDB Query Language         |
| **Escalabilidad**    | Limitada                        | Alta                           |
| **Uso en el Proyecto** | Desarrollo y pruebas           | Producción                     |

---

## **🔄 Flujo de una Solicitud**
1. **Cliente** envía una solicitud HTTP (ejemplo: `POST /auth/login`).
2. **Ruta** dirige la solicitud al controlador correspondiente.
3. **Middleware** valida la solicitud (ejemplo: `validateLogin`).
4. **Controlador** delega la lógica al servicio.
5. **Servicio** usa el proveedor para acceder a la base de datos.
6. **Proveedor** ejecuta la operación en la base de datos y devuelve los datos normalizados.
7. **Servicio** procesa los datos y devuelve el resultado al controlador.
8. **Controlador** envía una respuesta HTTP estandarizada al cliente.

---
## **⚡ Ventajas de Esta Arquitectura**
1. **Modularidad**: Cada componente tiene una responsabilidad clara.
2. **Escalabilidad**: Fácil de extender con nuevas funcionalidades.
3. **Mantenibilidad**: El código es fácil de entender y modificar.
4. **Reutilización**: Componentes como servicios y middlewares pueden reutilizarse.
5. **Flexibilidad**: Soporte para múltiples bases de datos sin cambiar la lógica de negocio.

---

## **📚 Conceptos Clave**

### **1. Normalización de Datos**
- Los **proveedores** normalizan los datos devueltos por la base de datos para garantizar un formato consistente en toda la aplicación.
- **Ejemplo**: Convertir `_id` de MongoDB a `id` para que los controladores y servicios trabajen con el mismo formato.

### **2. Separación de la Lógica de Negocio**
- Los **servicios** contienen la lógica de negocio, mientras que los **controladores** manejan las solicitudes HTTP.
- **Beneficio**: Los controladores no dependen de la base de datos, lo que facilita los cambios en el futuro.

### **3. Inyección de Dependencias**
- Los módulos se pasan como dependencias (ejemplo: `UserProvider` se inyecta en `userService`).
- **Beneficio**: Facilita las pruebas unitarias y el mantenimiento.

### **4. Middlewares**
- Funciones que se ejecutan en el **ciclo de vida** de una solicitud.
- **Ejemplos**:
  - Validación de datos (`express-validator`).
  - Autenticación (`authenticateToken`).
  - Autorización (`authorizeToken`).

### **5. Manejo de Errores Centralizado**
- Los errores se capturan y manejan en un solo lugar (`errorHandler`), evitando código repetido.

---

## **🛠 Herramientas y Tecnologías**
| Herramienta       | Propósito                                  |
|-------------------|--------------------------------------------|
| **Node.js**       | Entorno de ejecución para JavaScript.      |
| **Express**       | Framework para crear APIs RESTful.         |
| **Sequelize**     | ORM para SQLite.                           |
| **Mongoose**      | ODM para MongoDB.                          |
| **JWT**           | Autenticación basada en tokens.            |
| **Bcrypt**        | Encriptación de contraseñas.               |
| **express-validator** | Validación de datos de entrada.        |
| **Dotenv**        | Manejo de variables de entorno.            |

---

## **📝 Conclusión**
Este proyecto sigue **buenas prácticas de diseño** para crear una API **modular**, **escalable** y **fácil de mantener**. La separación en capas (rutas, controladores, servicios, proveedores) permite:
- **Reutilizar código**.
- **Cambiar componentes** sin afectar otros (ejemplo: cambiar de SQLite a MongoDB).
- **Escribir pruebas** de manera más sencilla.
- **Mantener un código limpio y organizado**.

---
**📌 Nota**: Si necesitas extender el proyecto, sigue la misma estructura y principios para mantener la coherencia.
```
