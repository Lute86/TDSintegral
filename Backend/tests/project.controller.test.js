// tests/project.controller.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/app.js'; 
import { Employee } from '../src/models/Employee.model.js'; 
import { Client } from '../src/models/Client.model.js'; 
import { Project } from '../src/models/Project.model.js'; 
import { generateToken } from '../src/utils/Jwt.utils.js'; 


// Variables globales para la prueba
let PROJECT_ID; 
let CLIENT_ID; 
let AUTH_TOKEN;
let EMPLOYEE_ID; 

// Emails únicos para limpieza de pruebas
const TEST_EMPLOYEE_EMAIL = 'emp.controller.proj@example.com';
const TEST_CLIENT_EMAIL = 'client.controller.proj@example.com';


// Datos de prueba (clienteId se asignará en beforeAll)
const projectData = {
    nombre: 'Proyecto Test POST',
    descripcion: 'Descripción del proyecto test',
    estado: 'pendiente',
    clienteId: null, // Será rellenado
    horasCotizadas: 50,
};

// Datos de actualización
const updateData = {
    nombre: 'Proyecto Test PUT Actualizado',
    estado: 'en curso',
    horasCotizadas: 75,
    clienteId: CLIENT_ID
};

// Inicialización: CONEXIÓN y CREACIÓN DE DEPENDENCIAS (Cliente y Empleado)
beforeAll(async () => {
    // 1. Conexión a DB (Patrón del test de tareas)
    await mongoose.connect(process.env.DB_TEST_URI || 'mongodb://localhost:27017/tds_back_test');

    // 2. Limpieza de datos (por emails de prueba)
    await Employee.deleteMany({ email: TEST_EMPLOYEE_EMAIL }); 
    await Client.deleteMany({ email: TEST_CLIENT_EMAIL });
    await Project.deleteMany({ nombre: projectData.nombre }); 

    // 3. Crear el Empleado de autenticación (ADMINISTRADOR)
    const employeeData = { 
        nombre: 'TestEmp', 
        apellido: 'ProjectController', 
        email: TEST_EMPLOYEE_EMAIL, 
        rol: 'administrador', 
        password: 'password123' 
    };
    
    const employee = await Employee.create(employeeData);
    EMPLOYEE_ID = employee._id;

    // 4. Generar el token (USANDO generateToken)
    AUTH_TOKEN = generateToken(EMPLOYEE_ID); 
    
    // 5. Crear el Cliente (necesario para el POST de Proyecto)
    const client = await Client.create({ nombre: 'TestClient', apellido: 'ProjectController', email: TEST_CLIENT_EMAIL });
    CLIENT_ID = client._id;
    
    // 6. Asignar CLIENT_ID al objeto de datos del proyecto
    projectData.clienteId = CLIENT_ID;
});

// Limpieza
afterAll(async () => {
    // 1. Limpiar el proyecto creado durante el test
    if(PROJECT_ID) await Project.deleteMany({ _id: PROJECT_ID });
    // 2. Limpiar Cliente y Empleado
    await Employee.deleteMany({ email: TEST_EMPLOYEE_EMAIL }); 
    await Client.deleteMany({ email: TEST_CLIENT_EMAIL });

    // 3. Cierra la conexión de Mongoose
    await mongoose.connection.close();
});


describe('🚀 Project Endpoints (Integración con HTTP)', () => {

    // 1. POST /projects - Debe crear un nuevo proyecto (201)
    test('POST /projects - Debe crear un nuevo proyecto (201)', async () => {
        const response = await request(app)
            .post('/project') 
            .set('Authorization', `Bearer ${AUTH_TOKEN}`)
            .send(projectData);

        // Extraer datos del cuerpo, manejando posibles envolturas ({data: ...})
        const projectResponseData = response.body.data || response.body;

        expect(response.statusCode).toBe(201);
        expect(projectResponseData).toHaveProperty('_id');
        expect(projectResponseData.nombre).toBe(projectData.nombre);
        expect(projectResponseData.estado).toBe(projectData.estado);

        PROJECT_ID = projectResponseData._id; // Guardar ID para tests posteriores
    });

    // 2. GET /projects/:id - Debe devolver el proyecto creado (200)
    test('GET /projects/:id - Debe devolver el proyecto creado (200)', async () => {
        if (!PROJECT_ID) return;
        
        const response = await request(app)
            .get(`/project/${PROJECT_ID}`) 
            .set('Authorization', `Bearer ${AUTH_TOKEN}`);
        
        const projectResponseData = response.body.data || response.body;

        expect(response.statusCode).toBe(200);
        expect(projectResponseData._id.toString()).toBe(PROJECT_ID.toString());
        expect(projectResponseData.nombre).toBe(projectData.nombre);
        // Verifica que el populate en el controlador funcionó
        expect(projectResponseData.clienteId).toHaveProperty('nombre'); 
    });

    // 3. PUT /projects/:id - Debe actualizar el proyecto (200)
    test('PUT /projects/:id - Debe actualizar el proyecto (200)', async () => {
        if (!PROJECT_ID) return;
        
        const response = await request(app)
            .put(`/project/${PROJECT_ID}`) 
            .set('Authorization', `Bearer ${AUTH_TOKEN}`)
            .send(updateData);
        
        const projectResponseData = response.body.data || response.body;

        expect(response.statusCode).toBe(200);
        expect(projectResponseData.nombre).toBe(updateData.nombre);
        expect(projectResponseData.estado).toBe(updateData.estado);
    });

    // 4. DELETE /projects/:id - Debe eliminar el proyecto (200) y verificar su ausencia (404)
    test('DELETE /projects/:id - Debe eliminar el proyecto (200) y verificar su ausencia (404)', async () => {
        if (!PROJECT_ID) return;

        // 1. Eliminar
        const deleteResponse = await request(app)
            .delete(`/project/${PROJECT_ID}`) 
            .set('Authorization', `Bearer ${AUTH_TOKEN}`);
        
        const deleteBody = deleteResponse.body.data || deleteResponse.body;

        expect(deleteResponse.statusCode).toBe(200);
        // El controller devuelve { message: "Proyecto eliminado" }
        expect(deleteBody.message).toBe('Proyecto eliminado'); 

        // 2. Verificar la ausencia (El controlador debe devolver 404)
        const getResponse = await request(app)
            .get(`/project/${PROJECT_ID}`) 
            .set('Authorization', `Bearer ${AUTH_TOKEN}`);
        console.log(" GET RESPONSE BODY DESPUÉS DEL DELETE:", getResponse.body);
        expect(getResponse.statusCode).toBe(404);
        
        // CORREGIDO: Buscamos el mensaje en las ubicaciones más probables (raíz, data, o directamente error)
        const errorMessage = getResponse.body.data ||  getResponse.body.message || getResponse.body.data?.message || getResponse.body.error || getResponse.body?.data?.error || getResponse.body?.msg; 
        expect(errorMessage).toBe('Proyecto no encontrado');
    });
});