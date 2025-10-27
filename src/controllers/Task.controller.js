import { TaskService } from "../services/Task.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";

export class TaskController {
  static async getAll(req, res) {
    try {
      const tasks = await TaskService.getAll();
      HttpResponse.success(res, tasks);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }

  static async getById(req, res) {
    try {
      const task = await TaskService.getById(req.params.id);
      if (!task) {
        return HttpResponse.notFound(res, "Tarea no encontrada");
      }
      HttpResponse.success(res, task);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }

  static async getByProject(req, res) {
    try {
      const tasks = await TaskService.getByProject(req.params.projectId);
      HttpResponse.success(res, tasks);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }

  static async getByEmployee(req, res) {
    try {
      const tasks = await TaskService.getByEmployee(req.params.employeeId);
      HttpResponse.success(res, tasks);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }

  static async create(req, res) {
    try {
      const task = await TaskService.create(req.body);
      HttpResponse.created(res, task);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }

  static async update(req, res) {
    try {
      const task = await TaskService.update(req.params.id, req.body);
      if (!task) {
        return HttpResponse.notFound(res, "Tarea no encontrada");
      }
      HttpResponse.success(res, task);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }

  static async delete(req, res) {
    try {
      const task = await TaskService.delete(req.params.id);
      if (!task) {
        return HttpResponse.notFound(res, "Tarea no encontrada");
      }
      HttpResponse.success(res, { message: "Tarea eliminada correctamente" });
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }
}
