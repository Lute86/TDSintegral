// src/controllers/Dashboard.controller.js
import { Project } from "../models/Project.model.js";
import { Task } from "../models/Task.model.js";
import { Employee } from "../models/Employee.model.js";

export class DashboardController {
  static async showDashboard(req, res) {
    try {
      const user = req.user;

      //  Filtrar proyectos según el rol
      const proyectos =
        user.rol === "administrador"
          ? await Project.find().lean()
          : await Project.find({ empleadoAsignado: user._id }).lean();

      //  Obtener todas las tareas asociadas a esos proyectos
      const projectIds = proyectos.map((p) => p._id);
      const tareas = await Task.find({ project: { $in: projectIds } })
        .populate("project", "nombre")
        .lean();

      //  Empleados solo visibles para administradores
      const empleados =
        user.rol === "administrador"
          ? await Employee.find().lean()
          : [];

      res.render("dashboardempleados", {
        user,
        proyectos,
        tareas,
        empleados,
      });
    } catch (err) {
      console.error("Error al renderizar dashboard:", err);
      res.status(500).send("Error interno al cargar el dashboard");
    }
  }
}
