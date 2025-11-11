import { ProjectService } from "../services/Project.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";

export class ProjectController {
  //  API JSON 
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

   // VISTA PUG 
  static async renderList(req, res) {
  try {
    const user = req.user;
    let projects;

    // Si es administrador → muestra todos los proyectos con sus detalles
    if (user.rol === "administrador") {
      projects = await ProjectService.getAllWithDetails();
    } 
    // Si es empleado → solo los proyectos donde participa
    else {
      projects = await ProjectService.getByEmployee(user._id);
    }

    // Renderiza la vista Pug 'projects/list'
    res.render("projects/list", {
      title: "Listado de Proyectos",
      user,
      projects,
    });
    
  } catch (error) {
    console.error("Error al renderizar proyectos:", error);
    res.status(500).send("Error al cargar proyectos");
  }
}

}
