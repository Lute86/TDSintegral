import mongoose from "mongoose";
import { Project } from "../src/models/Project.model.js"; 
import { Employee } from "../src/models/Employee.model.js";

// muchachos, acá el serivcio que testeamos :).
import { TaskService } from '../src/services/Task.service.js';
// Acá las IDs
let PROJECT_ID; 
let EMPLOYEE_ID;

describe('TaskService CRUD Operations (Integración)', () => {
    
    // Se ejecuta ANTES de cualquier test.
    beforeAll(async () => {
        // Conexión a MongoDB --> acá le va la misma q el .env.
        await mongoose.connect('mongodb://localhost:27017/miapp'); 

        const project = await Project.findOne();
        const employee = await Employee.findOne();

        if (!project || !employee) {
            throw new Error("ERROR: No se encontraron datos. ¡Asegúrate de ejecutar 'npm run seed'!");
        }

        PROJECT_ID = project._id;
        EMPLOYEE_ID = employee._id;
    });
// Esto se ejecuta despues de los tests...
    afterAll(async () => {
        // Desconexión de la base de datos
        await mongoose.connection.close();
    });
    test('Debe crear una nueva tarea y luego eliminarla correctamente', async () => {
        // Datos de prueba para el test
        const taskData = {
        
            project: PROJECT_ID, 
            
            // Campos requeridos por el modelo
            nombre: "TEST: Tarea de Integración",
            descripcion: "Prueba de creación de tarea para el CRUD",
            estado: "pendiente", // NECESARIO: para poder eliminarla
            prioridad: "media",

            // Horas deben ser 0 o positivas
            horasEstimadas: 8,
            horas: 0, 
            
            empleados: [EMPLOYEE_ID], 
        };

        let createdTask;
        
        // PRUEBA DE CREACIÓN (CREATE)
        try {
            createdTask = await TaskService.create(taskData);
        } catch (error) {
            // Si nos tira error acá es porque hay un bug o le pifiamos en un dato jeje
            throw new Error(`Fallo la creación de tarea en el servicio: ${error.message}`);
        }
        
        // Verificamos que se creó correctamente
        expect(createdTask).toBeDefined(); 
        expect(createdTask.nombre).toBe(taskData.nombre); 
        expect(createdTask.project.toString()).toBe(PROJECT_ID.toString()); // El ID debe coincidir
        expect(createdTask._id).toBeDefined();
        
        const taskId = createdTask._id;

        // PRUEBA DE ELIMINACIÓN (DELETE)
        try {
            // Usamos la función de limpieza del servicio (deleteById)
            const deleteResult = await TaskService.deleteById(taskId);
            expect(deleteResult.message).toBe("Tarea eliminada correctamente");
        } catch (error) {
            throw new Error(`Fallo la eliminación de tarea (limpieza) en el servicio: ${error.message}`);
        }
    });
    
    // GET by ID
test('Debe obtener una tarea por ID (Read/Get)', async () => {
        const testTitle = "TEST: Tarea para Obtener por ID";
        const taskData = {
            project: PROJECT_ID,
            nombre: testTitle,
            descripcion: "Prueba de lectura de tarea",
            estado: "pendiente",
            prioridad: "media",
            horasEstimadas: 1,
            horas: 0,
        };

        let createdTask = await TaskService.create(taskData);
        const taskId = createdTask._id;
        const foundTask = await TaskService.getById(taskId);
        
        expect(foundTask).toBeDefined();
        expect(foundTask._id.toString()).toBe(taskId.toString()); // El ID debe ser el mismo
        expect(foundTask.nombre).toBe(testTitle);
        
        // El servicio de Task.service.js usa populate, aseguramos que Project exista
        expect(foundTask.project).toBeDefined(); 

        await TaskService.deleteById(taskId);
    });   
 // UPDATE
test('Debe actualizar el estado y la descripción de una tarea correctamente (Update)', async () => {
        // 1. Setup: Crear la tarea inicial
        const initialTitle = "TEST: Tarea para Actualizar";
        const taskData = {
            project: PROJECT_ID,
            nombre: initialTitle,
            descripcion: "Descripción antigua",
            estado: "pendiente",
            prioridad: "baja",
            horasEstimadas: 2,
            horas: 0,
        };
        let createdTask = await TaskService.create(taskData);
        const taskId = createdTask._id;
        
        const updateData = {
            descripcion: "Descripción actualizada por Jest",
            estado: "en proceso", // Cambiamos el estado. Opciones en Task.model.js
            horas: 1,
        };

        // PRUEBA DE ACTUALIZACIÓN (UPDATE)
        const updatedTask = await TaskService.update(taskId, updateData);
        
        expect(updatedTask).toBeDefined();
        expect(updatedTask._id.toString()).toBe(taskId.toString());
        
        // Verificamos que los campos SÍ se hayan cambiado:
        expect(updatedTask.descripcion).toBe(updateData.descripcion);
        expect(updatedTask.estado).toBe(updateData.estado);
        expect(updatedTask.horas).toBe(updateData.horas);
        
        // Verificamos que el campo NO cambiado permanezca igual:
        expect(updatedTask.nombre).toBe(initialTitle); 

        await TaskService.update(taskId, { estado: "pendiente" });
        await TaskService.deleteById(taskId);
    });   
});