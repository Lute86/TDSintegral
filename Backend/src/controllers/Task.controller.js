import { TaskService } from "../services/Task.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";

export class TaskController {
  // Obtener todas las tareas
  static async getAll(req, res) {
    try {
      const tasks = await TaskService.getAll();
      return HttpResponse.success(res, tasks);
    } catch (err) {
      return HttpResponse.serverError(res, err.message);
    }
  }

  // Obtener una tarea por ID
  static async getById(req, res) {
    try {
      const task = await TaskService.getById(req.params.id);
      if (!task) {
        return HttpResponse.notFound(res, "Tarea no encontrada");
      }
      return HttpResponse.success(res, task);
    } catch (err) {
      return HttpResponse.serverError(res, err.message);
    }
  }

  // Crear una nueva tarea
  static async create(req, res) {
    try {
      const task = await TaskService.create(req.body);
      return HttpResponse.created(res, task);
    } catch (err) {
      return HttpResponse.serverError(res, err.message);
    }
  }

  // Actualizar parcialmente una tarea
  static async update(req, res) {
    try {
      const updated = await TaskService.update(req.params.id, req.body);
      if (!updated) {
        return HttpResponse.notFound(res, "Tarea no encontrada");
      }
      return HttpResponse.success(res, updated);
    } catch (err) {
      return HttpResponse.serverError(res, err.message);
    }
  }

  // Eliminar una tarea
  static async deleteById(req, res) {
    try {
      const deleted = await TaskService.deleteById(req.params.id);
      if (!deleted) {
        return HttpResponse.notFound(res, "Tarea no encontrada");
      }
      return HttpResponse.success(res, { message: "Tarea eliminada correctamente" });
    } catch (err) {
      return HttpResponse.serverError(res, err.message);
    }
  }
}
