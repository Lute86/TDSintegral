import { ProjectService } from "../services/Project.service.js";
import { TaskService } from "../services/Task.service.js";
import { EmployeeService } from "../services/Employee.service.js";
import { ClientService } from "../services/Client.service.js";
import { ContactService } from "../services/Contact.service.js";

export class DashboardController {
  static async renderDashboard(req, res) {
    try {
      const user = req.user;

      let proyectos = [];
      let tareas = [];
      let clientes = [];
      let empleados = []; 
      let consultas = [];
      let metricas = {
        tareasPendientes: 0,
        tareasEnProceso: 0,
        tareasFinalizadas: 0,
        totalTareas: 0
      };

      if (user.rol === "administrador") {
        // Admin ve todo
        proyectos = await ProjectService.getAll();
        tareas = await TaskService.getAll();
        clientes = await ClientService.getAll();
        empleados = await EmployeeService.getAll();
        consultas = await ContactService.getAll();
      } else if (user.rol === "empleado") {
        // Empleado ve solo sus proyectos y tareas
        proyectos = await ProjectService.getByEmployee(user._id);
        tareas = await TaskService.getByEmployee(user._id);
      }

      // Calcular métricas
      metricas.totalTareas = tareas.length;
      metricas.tareasPendientes = tareas.filter(t => t.estado === 'pendiente').length;
      metricas.tareasEnProceso = tareas.filter(t => t.estado === 'en proceso').length;
      metricas.tareasFinalizadas = tareas.filter(t => t.estado === 'finalizada').length;

      res.render("dashboard", {
        title: "Mi Dashboard",
        user,
        proyectos,
        tareas,
        clientes,
        empleados,
        consultas,
        metricas
      });
    } catch (error) {
      res.status(500).render("error", {
        message: "Error al cargar el dashboard"
      });
    }
  }
}