import { ProjectService } from "../services/Project.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";

export class ProjectController {
  static async getAll(req, res) {
    try {
      const projects = await ProjectService.getAll();
      HttpResponse.success(res, projects);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }

  static async getById(req, res) {
    try {
      const project = await ProjectService.getById(req.params.id);
      if (!project) return HttpResponse.notFound(res, "Proyecto no encontrado");
      HttpResponse.success(res, project);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }

  static async create(req, res) {
    try {
      const project = await ProjectService.create(req.body);
      HttpResponse.created(res, project);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }

  static async update(req, res) {
    try {
      const updated = await ProjectService.update(req.params.id, req.body);
      if (!updated) return HttpResponse.notFound(res, "Proyecto no encontrado");
      HttpResponse.success(res, updated);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }

  static async deleteById(req, res) {
    try {
      const deleted = await ProjectService.deleteById(req.params.id);
      if (!deleted) return HttpResponse.notFound(res, "Proyecto no encontrado");
      HttpResponse.success(res, { message: "Proyecto eliminado" });
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }
}
