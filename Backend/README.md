Primera entrega proyecto backend para "Desarrollo web (back)"

## Descripcion 1ra entrega

- Proyecto de Node.js y Express con una arquitectura simple de estilo MVC.

## Objetivos específicos:

Desarrollar una aplicación web utilizando Node.js y Express.

Integrar una base de datos (solamente en JSON), eliminamos a mongo de este parcial, pero si quieren lo pueden usar. 
Tutorial de instalacion de mongoDB https://www.youtube.com/watch?v=eKXIxSZrJfw&ab_channel=UskoKruM2010

Aplicar conceptos de asincronía y manejo de promesas. Módulos

Implementar un sistema de rutas dinámicas y middleware. Motor de plantillas Pug 

Crear y probarla (Además capturar la pantalla de alguna pruebe hecha en ThunderClient)

Seguir buenas prácticas de desarrollo, incluyendo la utilización de POO.

## Requisitos 

- node (https://nodejs.org/en/download) Mejor instalar nvm y luego la version adecuada de nodejs, ultima lts. 
- npm 

## 1. Inicializar

Clonar el repositorio:

git clone https://github.com/Lute86/TDSintegral.git

Instlar dependencias:

npm install

Crear environment:

crear archivo .env basado en .env.example (Se puede copiar y pegar sin el .example)

Correr el servidor:

npm run dev


## Mejoras 2da entrega

- Aplicar MongoDB
- Agregar seguridad:
  + encriptado passwords (bcrypt)
  + Autenticacion y autorizacion (jwt)
  + validacion de datos (express-validator) 
- Desarrollar todas las entidades y sus respectivos CRUDs

## Pruebas

Api calls validas

http://localhost:3000/dashboard/myprofile/1
{
  "status": 200,
  "statusMsg": "Successful petition",
  "data": {
    "id": 1,
    "nombre": "Ana"
  }
}

http://localhost:3000/dashboard/profiles
{
  "status": 200,
  "statusMsg": "Successful petition",
  "data": [
    {
      "id": 1,
      "nombre": "Ana"
    },
    {
      "id": 2,
      "nombre": "Juan"
    }
  ]
}