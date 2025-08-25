# **📡 Postman Collection:**

Esta colección te permite probar todos los endpoints de la API de gestión de usuarios. Asegúrate de configurar correctamente los **headers** y los **bodies** según cada solicitud.

---

## **📌 Configuración Inicial**

### **Variables de Entorno en Postman**
1. Crea un **Environment** en Postman llamado `User Management API`.
2. Agrega las siguientes variables:

| Variable       | Valor                     |
|----------------|---------------------------|
| `base_url`     | `http://localhost:3000`   |
| `jwt_token`    | *(Se completará después del login)* |

---

## **🔐 Autenticación**

### **1. Registrar un Nuevo Usuario**
- **Método**: `POST`
- **Endpoint**: `{{base_url}}/auth/register`
- **Headers**:
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Body (JSON)**:
  ```json
  {
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@example.com",
    "dni": "12345678A",
    "password": "securePassword123"
  }
  ```
- **Respuesta Exitosa (201 Created)**:
  ```json
  {
    "id": 1, // U oid de Mongo
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@example.com",
    "dni": "12345678A",
    "role": "User",
    "createdAt": "2025-08-24T12:00:00.000Z",
    "updatedAt": "2025-08-24T12:00:00.000Z"
  }
  ```

---

### **2. Iniciar Sesión (Login)**
- **Método**: `POST`
- **Endpoint**: `{{base_url}}/auth/login`
- **Headers**:
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Body (JSON)**:
  ```json
  {
    "email": "juan.perez@example.com",
    "password": "securePassword123"
  }
  ```
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "user": {
      "id": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan.perez@example.com",
      "role": "User"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tYnJlIjoiSm..."
  }
  ```
- **Acción Post-Login**:
  - Copia el valor del campo `token` y configúralo en la variable de entorno `jwt_token` de Postman.

---

### **3. Validar Token JWT**
- **Método**: `GET`
- **Endpoint**: `{{base_url}}/auth/token`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer {{jwt_token}}"
  }
  ```
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "status": 200,
    "message": "Token válido"
  }
  ```

---

## **👤 Usuarios**

### **1. Obtener Perfil de Usuario**
- **Método**: `GET`
- **Endpoint**: `{{base_url}}/user/profile/{id}`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer {{jwt_token}}"
  }
  ```
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@example.com",
    "dni": "12345678A",
    "role": "User"
  }
  ```

---

### **2. Actualizar Usuario**
- **Método**: `PUT`
- **Endpoint**: `{{base_url}}/user/{id}`
- **Headers**:
  ```json
  {
    "Content-Type": "application/json",
    "Authorization": "Bearer {{jwt_token}}"
  }
  ```
- **Body (JSON)**:
  ```json
  {
    "nombre": "Juan Carlos",
    "currentPassword": "securePassword123",
    "newPassword": "newSecurePassword456"
  }
  ```
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "id": 1,
    "nombre": "Juan Carlos",
    "apellido": "Pérez",
    "email": "juan.perez@example.com",
    "dni": "12345678A",
    "role": "User",
    "updatedAt": "2025-08-24T13:00:00.000Z"
  }
  ```

---

### **3. Eliminar Usuario**
- **Método**: `DELETE`
- **Endpoint**: `{{base_url}}/user/{id}`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer {{jwt_token}}"
  }
  ```
- **Respuesta Exitosa (204 No Content)**:
  *(No devuelve cuerpo de respuesta)*

---

## **👥 Administración**

### **1. Listar Todos los Usuarios**
- **Método**: `GET`
- **Endpoint**: `{{base_url}}/admin/users`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer {{jwt_token}}"
  }
  ```
- **Respuesta Exitosa (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "nombre": "Juan Carlos",
      "apellido": "Pérez",
      "email": "juan.perez@example.com",
      "role": "User"
    },
    {
      "id": 2,
      "nombre": "Ana",
      "apellido": "Gómez",
      "email": "ana.gomez@example.com",
      "role": "Admin"
    }
  ]
  ```

---

### **2. Recuperar Usuario Eliminado**
- **Método**: `PUT`
- **Endpoint**: `{{base_url}}/admin/recover/{id}`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer {{jwt_token}}"
  }
  ```
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "id": 1,
    "nombre": "Juan Carlos",
    "apellido": "Pérez",
    "email": "juan.perez@example.com",
    "role": "User"
  }
  ```

---

## **⚠️ Manejo de Errores**

### **Ejemplos de Respuestas de Error**

#### **1. Usuario no encontrado (404 Not Found)**
```json
{
  "action": "Buscar usuario",
  "message": "Usuario no encontrado"
}
```

#### **2. Contraseña incorrecta (400 Bad Request)**
```json
{
  "action": "Validar usuario",
  "message": "Contraseña incorrecta"
}
```

#### **3. No autorizado (403 Forbidden)**
```json
{
  "message": "Acceso denegado"
}
```

---

## **📌 Notas Adicionales**
- Asegúrate de que el servidor esté en ejecución antes de probar los endpoints.
- Para endpoints protegidos, siempre incluye el header `Authorization: Bearer {{jwt_token}}`.
- Si usas **MongoDB**, asegúrate de que el servicio esté en ejecución o configura correctamente la variable `MONGO_URI`.
