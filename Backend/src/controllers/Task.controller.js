import { TaskService } from "../services/Task.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";

export class TaskController {
  // API JSON
  static async getAll(req, res) {
    try {
      const tasks = await TaskService.getAll();
      return HttpResponse.success(res, tasks);
    } catch (err) {
      return HttpResponse.serverError(res, err.message);
    }
  }

  static async getById(req, res) {
    try {
      const task = await TaskService.getById(req.params.id);
      if (!task) return HttpResponse.notFound(res, "Tarea no encontrada");
      return HttpResponse.success(res, task);
    } catch (err) {
      return HttpResponse.serverError(res, err.message);
    }
  }

  //  Crear nueva tarea
  static async create(req, res) {
    try {
      const task = await TaskService.create({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        estado: req.body.estado,
        prioridad: req.body.prioridad,
        empleados: req.body.empleados,
        project: req.body.project,
        cliente: req.body.cliente,
        horasEstimadas: req.body.horasEstimadas,
        horas: req.body.horas
      });

      return HttpResponse.created(res, task);
    } catch (err) {
      return HttpResponse.serverError(res, err.message);
    }
  }

  static async update(req, res) {
    try {
      const updated = await TaskService.update(req.params.id, req.body);
      if (!updated) return HttpResponse.notFound(res, "Tarea no encontrada");
      return HttpResponse.success(res, updated);
    } catch (err) {
      return HttpResponse.serverError(res, err.message);
    }
  }

  static async deleteById(req, res) {
    try {
      const deleted = await TaskService.deleteById(req.params.id);
      return HttpResponse.success(res, deleted);
    } catch (err) {
      return HttpResponse.serverError(res, err.message);
    }
  }
static async getByProject(req, res) {
  try {
    const tasks = await TaskService.getByProject(req.params.projectId);
    return HttpResponse.success(res, tasks);
  } catch (err) {
    return HttpResponse.serverError(res, err.message);
  }
}

  // Vista PUG

  /*
  static async renderList(req, res) {
    try {
      const user = req.user;
      let tasks;

      if (user.rol === "administrador") {
        tasks = await TaskService.getAll();
      } else {
        tasks = await Task.find({ empleados: user._id }).populate("project");
      }

      res.render("tasks/list", {
        title: "Listado de Tareas",
        user,
        tasks,
      });
    } catch (error) {
      console.error("Error al renderizar tareas:", error);
      res.status(500).send("Error al cargar tareas");
    }
  }
*/
static async renderList(req, res) {
  try {
    const user = req.user;
    let tasks = [];

    if (user.rol === "administrador") {
      tasks = await TaskService.getAll();
    } else {
      // Empleado: ver solo tareas asignadas
      tasks = await TaskService.getByEmployee(user._id);
    }

    res.render("tasks/list", {
      title: "Listado de Tareas",
      user,
      tasks,
    });
  } catch (error) {
    console.error("Error al renderizar tareas:", error);
    res.status(500).send("Error al cargar tareas");
  }
}


}
