# Proyecto Node.js + Express + MongoDB

Documentación principal del proyecto, destinada para instalación, ejecución y entendimiento general del sistema.

---

# 1. Descripción General

Aplicación web desarrollada con **Node.js**, **Express** y **MongoDB**, siguiendo una arquitectura modular basada en MVC. El sistema gestiona clientes, empleados, proyectos y tareas, integrando lógica de negocio, autenticación y vistas renderizadas con el motor de plantillas **Pug**.

---

# 2. Requisitos Previos

* Node.js (se recomienda instalación mediante **nvm**, versión LTS)
* npm
* MongoDB instalado localmente
  Tutorial de instalación recomendado:
  [https://www.youtube.com/watch?v=eKXIxSZrJfw&ab_channel=UskoKruM2010](https://www.youtube.com/watch?v=eKXIxSZrJfw&ab_channel=UskoKruM2010)

---

# 3. Instalación y Configuración

## 3.1 Clonar el repositorio

```bash
git clone https://github.com/Lute86/TDSintegral.git
```

## 3.2 Instalar dependencias

```bash
npm install
```

## 3.3 Configurar variables de entorno

Crear archivo `.env` basado en el contenido de `.env.example`.

## 3.4. Inicialización de Datos (Seed)

### Ejecutar el seed

```bash
npm run seed 
o
node seed.js
```

### Usuarios generados

**Administrador**

* email: [admin@admin.com](mailto:admin@admin.com)
* password: admin

**Empleado**

* email: [empleado@empleado.com](mailto:empleado@empleado.com)
* password: admin
---


# 4 Iniciar el servidor

```bash
npm run dev
```

---

# 5. Endpoints de Prueba

### Obtener perfil por ID

GET `http://localhost:3000/dashboard/myprofile/1`

### Obtener listado de perfiles

GET `http://localhost:3000/dashboard/profiles`

### Eliminar empleado

DELETE `http://localhost:3000/dashboard/employee/2`

---

# 6. Landing Page

`http://localhost:3000/`

---

# 7. Estructura General del Proyecto

```
backend/
│
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── services/
│   ├── config/
│   ├── utils/
│   ├── views/
│   ├── public/
│   └── app.js
│
├── .env
├── seed.js
├── package.json
└── README.md
```

---

# 8. Tecnologías Utilizadas

* Node.js / Express
* MongoDB / Mongoose
* Pug (motor de vistas)
* Passport (autenticación)
* CSS y JS estático
* Arquitectura MVC + Servicios + Middlewares


