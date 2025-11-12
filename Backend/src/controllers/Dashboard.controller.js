import { Project } from "../models/Project.model.js";
import { Task } from "../models/Task.model.js";
import { Employee } from "../models/Employee.model.js";

export class DashboardController {
  static async renderDashboard(req, res) {
    try {
      const user = req.user;
      const projectId = req.query.project || null;

      // Listar todos los proyectos
      const projects = await Project.find().lean();

      // Si hay un proyecto seleccionado, mostrar sus tareas
      let tasks = [];
      if (projectId) {
        if (user.rol === "administrador") {
          tasks = await Task.find({ project: projectId }).populate("assignedTo").lean();
        } else {
          tasks = await Task.find({
            project: projectId,
            assignedTo: user._id
          }).populate("assignedTo").lean();
        }
      }

      res.render("dashboard", {
        user,
        projects,
        selectedProject: projectId,
        tasks,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error al cargar dashboard");
    }
  }
}
