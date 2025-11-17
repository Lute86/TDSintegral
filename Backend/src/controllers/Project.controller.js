/*import { ProjectService } from "../services/Project.service.js";
import { TaskService } from "../services/Task.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";
//import Project from "../models/Project.model.js";

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
static async renderNewForm(req, res) {
  try {
    res.render('projects/new'); // O la vista que uses
  } catch (error) {
    res.status(500).send('Error al cargar formulario de nuevo proyecto');
  }
}

static async renderEditForm(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send('Proyecto no encontrado');
    res.render('projects/edit', { project });
  } catch (error) {
    res.status(500).send('Error al cargar formulario de edición');
  }
}
//------------------------------------------------
static async list(req, res) {
    try {
      const projects = await ProjectService.getAllWithTasks();
      res.render("projects/list", { projects });
    } catch (error) {
      console.error("Error al listar proyectos:", error);
      res.status(500).send("Error al listar proyectos");
    }
  }

  static async showForm(req, res) {
    const { id } = req.params;
    let project = null;

    if (id) project = await ProjectService.getById(id);
    res.render("projects/form", { project });
  }

  static async save(req, res) {
    try {
      const { id, name, description } = req.body;
      if (id) {
        await ProjectService.update(id, { name, description });
      } else {
        await ProjectService.create({ name, description });
      }
      res.redirect("/projects");
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
      res.status(500).send("Error al guardar proyecto");
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await ProjectService.delete(id);
      res.redirect("/projects");
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
      res.status(500).send("Error al eliminar proyecto");
    }
  }


}
*/

import {Project} from "../models/Project.model.js";
import { ProjectService } from "../services/Project.service.js";
import { TaskService } from "../services/Task.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";

export class ProjectController {
  // VISTAS PUG
  static async renderList(req, res) {
    try {
      const user = req.user;
      let projects = [];

      if (user.rol === "administrador") {
        projects = await ProjectService.getAllWithDetails();
      } else {
        projects = await ProjectService.getByEmployee(user._id);
      }

      res.render("projects/list", { title: "Proyectos", user, projects });
    } catch (error) {
      console.error("Error al renderizar proyectos:", error);
      res.status(500).send("Error al cargar proyectos");
    }
  }

  static async renderNewForm(req, res) {
    try {
      res.render("projects/form", { title: "Nuevo Proyecto", project: {} });
    } catch (error) {
      res.status(500).send("Error al cargar formulario de nuevo proyecto");
    }
  }

  static async renderEditForm(req, res) {
    try {
      const project = await Project.findById(req.params.id).populate("tasks");
      if (!project) return res.status(404).send("Proyecto no encontrado");
      res.render("projects/form", { title: "Editar Proyecto", project });
    } catch (error) {
      res.status(500).send("Error al cargar formulario de edición");
    }
  }

  static async save(req, res) {
    try {
      const { id, nombre, descripcion } = req.body;
      if (id) {
        await ProjectService.update(id, { nombre, descripcion });
      } else {
        await ProjectService.create({ nombre, descripcion });
      }
      res.redirect("/project/view/list");
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
      res.status(500).send("Error al guardar proyecto");
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await ProjectService.deleteById(id);
      res.redirect("/project//list");
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
      res.status(500).send("Error al eliminar proyecto");
    }
  }

  // API JSON (por si querés usarlo después)
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
