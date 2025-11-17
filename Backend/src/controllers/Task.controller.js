/*import { TaskService } from "../services/Task.service.js";
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
*/
import { TaskService } from "../services/Task.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";

export class TaskController {
  // === API JSON ===
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

  static async create(req, res) {
    try {
      const task = await TaskService.create({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        estado: req.body.estado || "pendiente",
        prioridad: req.body.prioridad,
        empleados: req.body.empleados,
        project: req.body.project,
        cliente: req.body.cliente,
        horasEstimadas: req.body.horasEstimadas,
        horas: req.body.horas || 0,
      });

      req.flash("success", "Tarea creada correctamente");
      return res.redirect("/tasks/view/list");
    } catch (err) {
      console.error("Error al crear tarea:", err);
      req.flash("error", "Error al crear la tarea");
      return res.redirect("back");
    }
  }

  static async update(req, res) {
    try {
      const updated = await TaskService.update(req.params.id, req.body);
      if (!updated) return HttpResponse.notFound(res, "Tarea no encontrada");

      req.flash("success", "Tarea actualizada correctamente");
      return res.redirect("/tasks/view/list");
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
      req.flash("error", "Error al actualizar la tarea");
      return res.redirect("back");
    }
  }

  static async deleteById(req, res) {
    try {
      await TaskService.deleteById(req.params.id);
      req.flash("success", "Tarea eliminada correctamente");
      res.redirect("/tasks/view/list");
    } catch (err) {
      req.flash("error", "Error al eliminar tarea");
      res.redirect("back");
    }
  }
/*
  static async getByProject(req, res) {
    try {
      const tasks = await TaskService.getByProject(req.params.projectId);
      return HttpResponse.success(res, tasks);
    } catch (err) {
      return HttpResponse.serverError(res, err.message);
    }
  }
*/
  static async getByProject(req, res) {
  try {
    const projectId = req.params.projectId;
    const tasks = await TaskService.getByProject(projectId);
    return res.json(tasks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
  // === VISTAS PUG ===

  static async renderList(req, res) {
    try {
      const user = req.user;
      let tasks = [];

      if (user.rol === "administrador") {
        tasks = await TaskService.getAll();
      } else {
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

  static async renderNewForm(req, res) {
    res.render("tasks/form", {
      title: "Nueva Tarea",
      action: "/tasks",
      task: {},
      isEdit: false,
    });
  }

  static async renderEditForm(req, res) {
    try {
      const task = await TaskService.getById(req.params.id);
      if (!task) return res.status(404).send("Tarea no encontrada");

      res.render("tasks/form", {
        title: "Editar Tarea",
        action: `/tasks/${task._id}?_method=PUT`,
        task,
        isEdit: true,
      });
    } catch (err) {
      console.error("Error al cargar formulario de edición:", err);
      res.status(500).send("Error al cargar formulario de edición");
    }
  }

  // === Acciones rápidas ===

  static async updateEstado(req, res) {
    const { id } = req.params;
    const { estado, horasTrabajadas } = req.body;

    try {
      // Validación: para marcar como finalizada deben existir horas
      if (estado === "finalizada" && (!horasTrabajadas || horasTrabajadas <= 0)) {
        req.flash("error", "Debe registrar las horas trabajadas antes de finalizar la tarea.");
        return res.redirect("back");
      }

      await TaskService.update(id, { estado, horasTrabajadas });
      req.flash("success", "Estado actualizado correctamente");
      res.redirect("back");
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      req.flash("error", "Error al actualizar estado");
      res.redirect("back");
    }
  }

  //----------Delete

  static async renderDeleteForm(req, res) {
    try {
      const task = await TaskService.deleteById(req.params.id);
      res.redirect("/task/view/list");
    } catch (err) {
      console.error("Error al cargar lista de tareas:", err);
      res.status(500).send("Error al cargar lista de tareas");
    }
  }


}
