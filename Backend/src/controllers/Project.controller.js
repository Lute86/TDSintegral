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

    if (!project || (typeof project === "object" && !Array.isArray(project) && Object.keys(project).length === 0)) {
      return HttpResponse.notFound(res, "Proyecto no encontrado");
    }

    HttpResponse.success(res, project);

  } catch (err) {
    if (err.name === "CastError") {
      return HttpResponse.notFound(res, "Proyecto no encontrado");
    }

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
      console.log("Error en update",err)
      if (err.name === 'CastError') {
        return HttpResponse.notFound(res, "Proyecto no encontrado");
      }
      HttpResponse.serverError(res, err.message);
    }
  }

  static async deleteById(req, res) {
    try {
      const deleted = await ProjectService.deleteById(req.params.id);
      if (!deleted) return HttpResponse.notFound(res, "Proyecto no encontrado");
      HttpResponse.success(res, { message: "Proyecto eliminado" });
    } catch (err) {
      // AÑADIDO: Si es un CastError, devolvemos 404
      if (err.name === 'CastError') {
        return HttpResponse.notFound(res, "Proyecto no encontrado");
      }
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

  // ========== MÉTODO SAVE CON DEPURACIÓN ==========
  static async save(req, res) {
    try {
      console.log('🔍 ========== INICIO SAVE ==========');
      console.log('🔍 REQ.BODY COMPLETO:', req.body);
      console.log('🔍 REQ.USER:', req.user);
      
      const { id, nombre, name, descripcion, description, servicios, estado, horasCotizadas, clienteId } = req.body;
      
      console.log('🔍 Variables extraídas:');
      console.log('   - nombre:', nombre);
      console.log('   - name:', name);
      console.log('   - clienteId:', clienteId);
      console.log('   - horasCotizadas:', horasCotizadas);
      console.log('   - servicios:', servicios);
      console.log('   - estado:', estado);
      console.log('   - descripcion:', descripcion);

      // Usar nombre/descripcion (español) o name/description (inglés)
      const projectName = nombre || name;
      const projectDescription = descripcion || description;

      console.log('📝 Nombre final:', projectName);
      console.log('📝 ClienteId final:', clienteId);

      if (!projectName) {
        console.log('❌ ERROR: El nombre del proyecto está vacío');
        throw new Error("El nombre del proyecto es obligatorio");
      }

      if (!clienteId) {
        console.log('❌ ERROR: El clienteId está vacío');
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

      console.log('📦 Datos preparados para guardar:', JSON.stringify(projectData, null, 2));

      if (id) {
        // Actualizar proyecto existente
        const actualizado = await ProjectService.update(id, projectData);
        console.log('✅ Proyecto actualizado:', actualizado);
      } else {
        // Crear nuevo proyecto
        const nuevoProyecto = await ProjectService.create(projectData);
        console.log('✅ Proyecto creado exitosamente:', nuevoProyecto);
      }
      
      console.log('🔍 ========== FIN SAVE ==========');
      res.redirect("/dashboard");
    } catch (error) {
      console.error("❌ Error al guardar proyecto:", error);
      res.status(500).send("Error al guardar proyecto: " + error.message);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await ProjectService.deleteById(id);
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
      res.status(500).send("Error al eliminar proyecto");
    }
  }
}