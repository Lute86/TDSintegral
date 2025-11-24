import { ProjectService } from "../services/Project.service.js";
import { TaskService } from "../services/Task.service.js";
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

   // VISTAS PUG 
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
      res.status(500).render("error", {
        message: "Error al cargar el dashboard"
      });
    }
  }

  static async list(req, res) {
    try {
      const projects = await ProjectService.getAllWithTasks();
      res.render("projects/list", { projects });
    } catch (error) {
      console.error("Error al listar proyectos:", error);
      res.status(500).render("error", {
        message: "Error al cargar el dashboard"
      });
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
      const { id, nombre, name, descripcion, description, servicios, estado, horasCotizadas, clienteId } = req.body;
    
      const projectName = nombre || name;
      const projectDescription = descripcion || description;


      if (!projectName) {
        throw new Error("El nombre del proyecto es obligatorio");
      }

      if (!clienteId) {
        throw new Error("Debe seleccionar un cliente");
      }

      // Preparar datos según el modelo Project
      const projectData = {
        nombre: projectName,
        clienteId: clienteId,
        empleados: req.user ? [req.user.id] : [],
        estado: estado || 'pendiente',
        metricas: {
          horasCotizadas: parseInt(horasCotizadas) || 0,
          horasTotales: 0,
          horasRedes: 0,
          horasMails: 0
        }
      };

      // Agregar servicios en la descripción si existen
      if (servicios) {
        const serviciosArray = Array.isArray(servicios) ? servicios : [servicios];
        const serviciosText = serviciosArray.join(', ');
        projectData.descripcion = projectDescription ? 
          `${projectDescription}\n\nServicios contratados: ${serviciosText}` : 
          `Servicios contratados: ${serviciosText}`;
      } else {
        projectData.descripcion = projectDescription || '';
      }

 
      if (id) {
        // Actualizar proyecto existente
        const actualizado = await ProjectService.update(id, projectData);
      } else {
        // Crear nuevo proyecto
        const nuevoProyecto = await ProjectService.create(projectData);
      }
      
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error al guardar proyecto: " + error.message);
      res.redirect("/dashboard");
    }
  }

  static async updateView(req, res) {
    try {
      const { id } = req.params;
      const { nombre, name, descripcion, description, servicios, estado, horasCotizadas, clienteId } = req.body;

      if (!id) throw new Error("ID de proyecto faltante");

      // Aceptar nombre en español o inglés
      const projectName = nombre || name;
      const projectDescription = descripcion || description;

      if (!projectName) {
        throw new Error("El nombre del proyecto es obligatorio");
      }

      if (!clienteId) {
        throw new Error("Debe seleccionar un cliente");
      }

      // Construcción del objeto final (idéntico a save)
      const projectData = {
        nombre: projectName,
        clienteId: clienteId,
        estado: estado || 'pendiente',
        metricas: {
          horasCotizadas: parseInt(horasCotizadas) || 0,
          horasTotales: 0,
          horasRedes: 0,
          horasMails: 0
        }
      };

      // Servicios (opcional)
      if (servicios) {
        const serviciosArray = Array.isArray(servicios) ? servicios : [servicios];
        const serviciosText = serviciosArray.join(', ');
        projectData.descripcion = projectDescription
          ? `${projectDescription}\n\nServicios contratados: ${serviciosText}`
          : `Servicios contratados: ${serviciosText}`;
      } else {
        projectData.descripcion = projectDescription || '';
      }

      // Actualizar proyecto
      await ProjectService.update(id, projectData);

      res.redirect("/dashboard");

    } catch (error) {
      res.status(500).render("error", {
        message: `Error al actualizar el dashboard ${error.message}`
      });
    }
  }
 
    static async delete(req, res) {
      try {
        const { id } = req.params;
      await ProjectService.deleteById(id);
      res.redirect("/dashboard");
    } catch (error) {
      res.status(500).render("error", {
        message: `Error al borrar ${error.message}`
      });
    }
  }
}