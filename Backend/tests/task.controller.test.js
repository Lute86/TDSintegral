import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/app.js'; 
import { Employee } from '../src/models/Employee.model.js'; 
import { Client } from '../src/models/Client.model.js'; 
import { Project } from '../src/models/Project.model.js'; 
import { generateToken } from '../src/utils/Jwt.utils.js'; 

// Variables globales para los tests
let AUTH_TOKEN;
let CLIENT_ID;
let PROJECT_ID;
let TASK_ID;
let EMPLOYEE_ID;

// Variables de datos
const taskData = {
    nombre: 'Tarea Test POST',
    descripcion: 'Descripción de la tarea test',
    estado: 'pendiente',
    tipo: 'Redes Sociales',
    fechaLimite: '2025-12-31',
    horas: 5,
};

const updateData = {
    estado: 'en proceso',
};


describe('🚀 Task Endpoints (Integración con HTTP)', () => {

    // --- Configuración Inicial: Garantizar Datos y Conexión ---
    beforeAll(async () => {
        // 1. Conexión a DB de tests
        await mongoose.connect(process.env.DB_TEST_URI || 'mongodb://localhost:27017/tds_back_test');

        // 2. Limpieza de datos (CRÍTICO: Limpiar colecciones antes de crear)
        await Employee.deleteMany({ email: 'emp.controller@example.com' }); 
        await Client.deleteMany({ email: 'test.controller@example.com' });
        await Project.deleteMany({});
        
        // 3. **CREAR** el Empleado de autenticación (ADMINISTRADOR)
        const employeeData = { 
            nombre: 'TestEmp', 
            apellido: 'Controller', 
            email: 'emp.controller@example.com', 
            rol: 'administrador', 
            // Recuerda que en tu modelo de Employee la contraseña debe estar hasheada
            password: 'password123' 
        };
        
        const employee = await Employee.create(employeeData);
        EMPLOYEE_ID = employee._id;

        // 4. Generar el token (usa la clave 'admin123' o la clave del ambiente)
        AUTH_TOKEN = generateToken(EMPLOYEE_ID); 
        
        // 5. Crear el Cliente y el Proyecto (necesarios para el POST de Tarea)
        const client = await Client.create({ nombre: 'TestClient', apellido: 'Controller', email: 'test.controller@example.com' });
        CLIENT_ID = client._id;

        const project = await Project.create({ 
            nombre: `TEST: Project for Task Controller - ${Date.now()}`, 
            clienteId: CLIENT_ID, 
            estado: 'pendiente' 
        });
        PROJECT_ID = project._id;
        
        // Asignar PROJECT_ID al objeto de datos de la tarea
        taskData.project = PROJECT_ID; 
    });

    // --- Limpieza Final ---
    afterAll(async () => {
        // Limpia las colecciones después de todos los tests
        await Employee.deleteMany({ email: 'emp.controller@example.com' });
        await Client.deleteMany({ email: 'test.controller@example.com' });
        await Project.deleteMany({ _id: PROJECT_ID }); 

        // Cierra la conexión de Mongoose
        await mongoose.connection.close();
    });


    // --- Tests de Tareas ---

    // 1. POST /tasks - Debe crear una nueva tarea (201)
    test('POST /tasks - Debe crear una nueva tarea (201)', async () => {
        const response = await request(app)
            .post('/tasks') 
            .set('Authorization', `Bearer ${AUTH_TOKEN}`)
            .send(taskData);
            
        // El cuerpo real de la tarea está dentro de 'data' debido al uso de HttpResponse.
        const taskResponseData = response.body.data || response.body;

        expect(response.statusCode).toBe(201); // 201: Creado
        expect(taskResponseData).toHaveProperty('_id'); // CORREGIDO: chequea 'data._id'
        expect(taskResponseData.nombre).toBe(taskData.nombre); // CORREGIDO: chequea 'data.nombre'
        TASK_ID = taskResponseData._id; // CORREGIDO: Guarda el ID correctamente
    });

    // 2. GET /tasks/:id - Debe obtener la tarea por ID (200)
    test('GET /tasks/:id - Debe obtener la tarea por ID (200)', async () => {
        if (!TASK_ID) {
            console.error("TASK_ID no definido, saltando prueba GET.");
            return;
        }

        const response = await request(app)
            .get(`/tasks/${TASK_ID}`) 
            .set('Authorization', `Bearer ${AUTH_TOKEN}`);
        
        // Si el controlador también envuelve la respuesta del GET
        const taskResponseData = response.body.data || response.body;

        expect(response.statusCode).toBe(200);
        // Debe verificar la propiedad en el cuerpo correcto
        expect(taskResponseData.nombre).toContain('Tarea Test POST');
        expect(taskResponseData).toHaveProperty('project'); // Verifica que el populate funcionó en el controlador
    });

    // 3. PUT /tasks/:id - Debe actualizar el estado de la tarea (200)
    test('PUT /tasks/:id - Debe actualizar el estado de la tarea (200)', async () => {
        if (!TASK_ID) {
            console.error("TASK_ID no definido, saltando prueba PUT.");
            return;
        }
        
        const response = await request(app)
            .put(`/tasks/${TASK_ID}`) 
            .set('Authorization', `Bearer ${AUTH_TOKEN}`)
            .send(updateData);
        
        const taskResponseData = response.body.data || response.body;

        expect(response.statusCode).toBe(200); // 200: OK
        // Debe verificar la propiedad en el cuerpo correcto
        expect(taskResponseData.estado).toBe('en proceso');
    });

    // 4. DELETE /tasks/:id - Debe eliminar la tarea (200) y verificar su ausencia (404)
    test('DELETE /tasks/:id - Debe eliminar la tarea (200) y verificar su ausencia (404)', async () => {
        if (!TASK_ID) {
            console.error("TASK_ID no definido, saltando prueba DELETE.");
            return;
        }
    await request(app)
            .put(`/tasks/${TASK_ID}`) 
            .set('Authorization', `Bearer ${AUTH_TOKEN}`)
            .send({ estado: 'pendiente' }); // Vuelve a 'pendiente' para cumplir la regla    
        // 1. Eliminar
        const deleteResponse = await request(app)
            .delete(`/tasks/${TASK_ID}`) 
            .set('Authorization', `Bearer ${AUTH_TOKEN}`);
        
        // Si el DELETE usa HttpResponse.success, el cuerpo será { data: { message: ... } }
        // Si solo retorna el mensaje, el cuerpo será { message: ... }
        
        expect(deleteResponse.statusCode).toBe(200);
        // Manejamos si el mensaje está en el nivel superior o dentro de 'data'
        expect(deleteResponse.body.message || deleteResponse.body.data?.message).toBe('Tarea eliminada correctamente');

        // 2. Verificar la ausencia (El controlador debe devolver 404)
        const getResponse = await request(app)
            .get(`/tasks/${TASK_ID}`) 
            .set('Authorization', `Bearer ${AUTH_TOKEN}`);

        expect(getResponse.statusCode).toBe(404);
        const errorMessage = getResponse.body.message || getResponse.body.data?.message;
        expect(errorMessage).toBe('Tarea no encontrada');
    });

});