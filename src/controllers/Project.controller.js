
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
      if (!project) {
        return HttpResponse.notFound(res, "Proyecto no encontrado");
      }
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
      const project = await ProjectService.update(req.params.id, req.body);
      if (!project) {
        return HttpResponse.notFound(res, "Proyecto no encontrado");
      }
      HttpResponse.success(res, project);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }

  static async delete(req, res) {
    try {
      const project = await ProjectService.delete(req.params.id);
      if (!project) {
        return HttpResponse.notFound(res, "Proyecto no encontrado");
      }
      HttpResponse.success(res, { message: "Proyecto eliminado correctamente" });
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }
}