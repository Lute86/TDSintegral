import { TaskService } from "../services/Task.service.js";
import { ProjectService } from "../services/Project.service.js";
import { EmployeeService } from "../services/Employee.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";

export class TaskController {
  // API: Obtener todas las tareas
  static async getAll(req, res) {
    try {
      const tasks = await TaskService.getAll();
      HttpResponse.success(res, tasks);
    } catch (error) {
      HttpResponse.serverError(res, error.message);
    }
  }

// API: Obtener tarea por ID
  static async getById(req, res) {
    try {
      const task = await TaskService.getById(req.params.id);
      // Paso 1: Si no encuentra nada (devuelve null), es 404
      if (!task) {
        return HttpResponse.notFound(res, { message: "Tarea no encontrada" });
      }
      HttpResponse.success(res, task);
    } catch (error) {
      // Paso 2: Si hay un error al leer el ID (CastError), lo tratamos como "no encontrado" (404)
      // MODIFICACIÓN CLAVE: Cualquier error que surja durante un GET por ID (incluyendo 
      // fallos de populate en documentos eliminados) lo manejamos como 404.
      if (error.name === 'CastError' || error.name === 'Error') { // Incluimos Error genérico
        return HttpResponse.notFound(res, { message: "Tarea no encontrada" });
      }
      // Si es cualquier otro error (ej. DB desconectada), es 500
      HttpResponse.serverError(res, error.message);
    }
  }

  // API: Obtener tareas por proyecto
  static async getByProject(req, res) {
    try {
      const tasks = await TaskService.getByProject(req.params.projectId);
      HttpResponse.success(res, tasks);
    } catch (error) {
      HttpResponse.serverError(res, error.message);
    }
  }

  // API: Crear tarea
  static async create(req, res) {
    try {
      const task = await TaskService.create(req.body);
      HttpResponse.created(res, task);
    } catch (error) {
      // Esto captura errores de validación de Mongoose (400)
      HttpResponse.badRequest(res, error.message);
    }
  }

  // Dashboard: Guardar tarea desde modal
  static async save(req, res) {
    try {
      const { nombre, descripcion, estado, prioridad, fechaInicio, fechaFin, horasEstimadas, project, empleados } = req.body;

      // Convertir empleados a array si viene como string único
      let empleadosArray = [];
      if (empleados) {
        empleadosArray = Array.isArray(empleados) ? empleados : [empleados];
      }

      await TaskService.create({
        nombre,
        descripcion,
        estado: estado || 'pendiente',
        prioridad: prioridad || 'media',
        fechaInicio,
        fechaFin,
        horasEstimadas: horasEstimadas || 0,
        project,
        empleados: empleadosArray,
        horas: 0
      });

      console.log('✅ Tarea creada correctamente');
      res.redirect('/dashboard');
    } catch (error) {
      console.error('❌ Error al guardar tarea:', error.message);
      res.status(500).send('Error al crear la tarea: ' + error.message);
    }
  }

  // API: Actualizar tarea
  static async update(req, res) {
    try {
      const task = await TaskService.update(req.params.id, req.body);
      
      // Si el servicio devuelve null/undefined, es 404.
      if (!task) {
        return HttpResponse.notFound(res, { message: "Tarea no encontrada" });
      }
      
      HttpResponse.success(res, task);
    } catch (error) {
      // Si el error es CastError (ID malo), lo tratamos como "no encontrado" (404)
      if (error.name === 'CastError') {
        return HttpResponse.notFound(res, { message: "Tarea no encontrada" });
      }
      // Si es ValidationError (datos malos), devolvemos 400.
      if (error.name === 'ValidationError') {
        return HttpResponse.badRequest(res, error.message);
      }
      // Cualquier otro error es 500
      HttpResponse.serverError(res, error.message);
    }
  }

  // Dashboard: Actualizar tarea desde modal
  static async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, estado, project, empleados } = req.body;

      let empleadosArray = [];
      if (empleados) {
        empleadosArray = Array.isArray(empleados) ? empleados : [empleados];
      }

      await TaskService.update(id, {
        nombre,
        descripcion,
        estado,
        project,
        empleados: empleadosArray
      });

      console.log('✅ Tarea actualizada correctamente');
      res.redirect('/dashboard');
    } catch (error) {
      console.error('❌ Error al actualizar tarea:', error.message);
      res.status(500).send('Error al actualizar la tarea');
    }
  }

  // Dashboard: Actualizar solo estado
  static async updateEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      await TaskService.update(id, { estado });
      res.redirect('back');
    } catch (error) {
      console.error('❌ Error al actualizar estado:', error.message);
      res.status(500).send('Error al actualizar estado');
    }
  }

  // Dashboard: Registrar horas
  static async updateHoras(req, res) {
    try {
      const { id } = req.params;
      const { horas } = req.body;

      await TaskService.update(id, { horas });
      res.redirect('back');
    } catch (error) {
      console.error('❌ Error al registrar horas:', error.message);
      res.status(500).send('Error al registrar horas');
    }
  }

  // API: Eliminar tarea
  static async deleteById(req, res) {
    try {
      const result = await TaskService.deleteById(req.params.id);
      
      // Si el servicio devuelve 0 documentos eliminados, es 404.
      if (!result || result.deletedCount === 0) {
        return HttpResponse.notFound(res, { message: "Tarea no encontrada" });
      }
      
      HttpResponse.success(res, { message: 'Tarea eliminada correctamente' });
    } catch (error) {
      // Si hay un error al leer el ID (CastError), lo tratamos como "no encontrado" (404)
      if (error.name === 'CastError') {
        return HttpResponse.notFound(res, { message: "Tarea no encontrada" });
      }
      // Captura errores genéricos (500)
      HttpResponse.serverError(res, error.message);
    }
  }

  // Vista: Renderizar lista de tareas
  static async renderList(req, res) {
    try {
      const tasks = await TaskService.getAll();
      const projects = await ProjectService.getAll();
      const employees = await EmployeeService.getAll();

      res.render('tasks/list', {
        tasks,
        projects,
        employees,
        user: req.user
      });
    } catch (error) {
      console.error('❌ Error al cargar tareas:', error.message);
      res.status(500).send('Error al cargar las tareas');
    }
  }
}