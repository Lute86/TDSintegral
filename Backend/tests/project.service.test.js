import mongoose from "mongoose";
import { ProjectService } from "../src/services/Project.service.js";
// Necesitamos importar los modelos para obtener IDs y para la limpieza
import { Project } from "../src/models/Project.model.js"; 
import { Client } from "../src/models/Client.model.js";
import { Employee } from "../src/models/Employee.model.js";
import { Task } from "../src/models/Task.model.js"; 


// Variables para IDs que vamos a necesitar para las validaciones
let CLIENT_ID; 
let EMPLOYEE_ID;

// Definimos el grupo de pruebas para el Servicio de Proyectos
describe('Project Service CRUD Operations (Integración)', () => {
    
    // --- SETUP: Conexión y Obtención de IDs ---
    beforeAll(async () => {
        // Conexión a MongoDB
        await mongoose.connect('mongodb://localhost:27017/miapp'); 

        // CRUCIAL: Necesitamos un Client ID y Employee ID válidos para crear un Proyecto
        const client = await Client.findOne();
        const employee = await Employee.findOne();

        if (!client || !employee) {
            throw new Error("ERROR: No se encontraron Client/Employee. ¡Asegúrate de ejecutar 'npm run seed'!");
        }

        CLIENT_ID = client._id;
        EMPLOYEE_ID = employee._id;
    });

    afterAll(async () => {
        // Desconexión de la base de datos
        await mongoose.connection.close();
    });

    // --- TEST 1: Creación y Eliminación (CREATE & CASCADING DELETE) ---

    test('Debe crear un proyecto, una tarea asociada y luego eliminarlos en cascada', async () => {
        const projectName = "TEST: Proyecto para Borrado en Cascada";
        const projectData = {
            nombre: projectName,
            descripcion: "Proyecto con tarea asociada",
            estado: "pendiente", // Asumo un estado válido para Project
            clienteId: CLIENT_ID, // Requerido por ProjectService.create
            empleados: [EMPLOYEE_ID], // Opcional, pero bueno para la prueba
            fechaInicio: new Date(),
        };

        let createdProject;
        
        // 1. CREACIÓN DEL PROYECTO
        createdProject = await ProjectService.create(projectData);
        const projectId = createdProject._id;
        
        // 2. CREACIÓN DE UNA TAREA ASOCIADA (PARA PROBAR EL BORRADO EN CASCADA)
        const taskData = {
            project: projectId, // Enlazamos la tarea al proyecto de prueba
            nombre: "Tarea Asociada al Proyecto Test",
            descripcion: "Tarea que debe borrarse con el proyecto",
            estado: "pendiente", 
            prioridad: "media",
            horasEstimadas: 1,
            horas: 0, 
        };
        // Uso el modelo Task directamente para crearla y evitar la validación de TaskService.create
        // Tarea debe ser importado: import { Task } from "../src/models/Task.model.js";
        const createdTask = await Task.create(taskData); 

        // 3. ASUNCIONES PRE-DELETE: La tarea existe
        expect(createdTask).toBeDefined(); 
        let taskCountBefore = await Task.countDocuments({ project: projectId });
        expect(taskCountBefore).toBe(1);

        // 4. PRUEBA DE ELIMINACIÓN (DELETE)
        const deleteResult = await ProjectService.deleteById(projectId);
        
        // 5. ASUNCIONES POST-DELETE
        expect(deleteResult.message).toBe("Proyecto y todas sus tareas eliminadas correctamente");
        
        // Verificación CRUCIAL: El proyecto y la tarea ya no existen
        const projectExists = await Project.findById(projectId);
        const taskCountAfter = await Task.countDocuments({ project: projectId });

        expect(projectExists).toBeNull(); // El proyecto DEBE haber sido borrado
        expect(taskCountAfter).toBe(0); // La tarea ASOCIADA DEBE haber sido borrada (Cascada)
    });

    // --- TEST 2: Leer por ID (READ) ---
test('Debe crear un proyecto y obtenerlo por ID con los datos poblados', async () => {
        // CORRECCIÓN: Usar un nombre único para evitar colisiones
        const testName = `TEST: Proyecto para Leer - ${Date.now()}`; // <--- ESTA ES LA CORRECCIÓN
        const projectData = {
            nombre: testName, // Ahora usa el nombre único
            descripcion: "Lectura de proyecto",
            estado: "pendiente", // Corregido previamente
            clienteId: CLIENT_ID,
            fechaInicio: new Date(),
        };

        let createdProject = await ProjectService.create(projectData);
        const projectId = createdProject._id;

        // 2. PRUEBA DE OBTENCIÓN (READ)
        const foundProject = await ProjectService.getById(projectId);
        
        // --- LÍNEA DE DIAGNÓSTICO ---
        console.log("Objeto devuelto por ProjectService.getById:", foundProject);
        // ------
        // 3. Aserciones:
        expect(foundProject).toBeDefined();
        expect(foundProject._id.toString()).toBe(projectId.toString());
        expect(foundProject.nombre).toBe(testName);
        
        // Verificación de Integración (Populate)
        // El campo 'clienteId' debe ser un objeto (el Cliente) y no solo un ID
        expect(foundProject.clienteId).toBeDefined();
        expect(foundProject.clienteId.nombre).toBeDefined(); // Asume que el modelo Cliente tiene campo 'nombre'

        // 4. Limpieza: Eliminar el proyecto
        await ProjectService.deleteById(projectId);
    });
    
// --- TEST 3: Actualización Parcial (UPDATE) ---

test('Debe actualizar parcialmente un proyecto y mantener los campos no enviados', async () => {
    //  SETUP: Crear un proyecto inicial
    const initialName = `TEST: Proyecto Inicial - ${Date.now()}`;
    const projectData = {
        nombre: initialName,
        descripcion: "Descripción antigua",
        estado: "pendiente",
        clienteId: CLIENT_ID,
        empleados: [EMPLOYEE_ID],
        fechaInicio: new Date(),
    };

    let createdProject = await ProjectService.create(projectData);
    const projectId = createdProject._id;

    // DATOS DE ACTUALIZACIÓN: Solo modificamos dos campos
    const updateData = {
        estado: "en curso",
        descripcion: "Descripción actualizada", 
    };

    // Llamar a la función de actualización (Solo actualiza, no leemos)
    await ProjectService.update(projectId, updateData); // <--- QUITAMOS LA ASIGNACIÓN A UNA VARIABLE

    // Re-leer el documento actualizado con getById 
    const foundUpdatedProject = await ProjectService.getById(projectId); // <--- LECTURA SEPARADA

    // ASUNCIONES: Verificar los cambios en el objeto encontrado (foundUpdatedProject)
    expect(foundUpdatedProject).toBeDefined();

    // Los campos modificados DEBEN cambiar
    expect(foundUpdatedProject.estado).toBe("en curso");
    expect(foundUpdatedProject.descripcion).toBe(updateData.descripcion); 

    // Los campos NO modificados DEBEN mantenerse (CRUCIAL)
    expect(foundUpdatedProject.nombre).toBe(initialName);

    expect(foundUpdatedProject.clienteId.nombre).toBeDefined(); 

    // Eliminar el proyecto
    await ProjectService.deleteById(projectId);
});   

});