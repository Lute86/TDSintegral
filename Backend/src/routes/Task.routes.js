import { Router } from "express";
import { TaskController } from "../controllers/Task.controller.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js";
import { Task } from "../models/Task.model.js";

class TaskRoutes {
  static getRouter() {
    const router = Router();
    
    // ========== RUTAS ESPECÍFICAS PRIMERO ==========
    // Tareas por proyecto (usado por JS)
    router.get('/project/:projectId', TaskController.getByProject);
    
    // Vista de lista
    router.get("/view/list", 
      AuthMiddleware.authorize("administrador", "empleado"),
      TaskController.renderList
    );

    // ========== RUTAS DE FORMULARIOS (POST/PUT/DELETE) ==========
    // Guardar tarea desde el modal (la más importante)
    router.post("/save", TaskController.save);
    
    // Actualizar estado de tarea
    router.post("/:id/updateEstado", 
      AuthMiddleware.authorize("empleado", "administrador"), 
      async (req, res) => {
        const { id } = req.params;
        const { estado } = req.body;
        try {
          await Task.findByIdAndUpdate(id, { estado });
          res.redirect("back");
        } catch (err) {
          console.error("Error al actualizar estado:", err);
          res.status(500).send("Error al actualizar estado");
        }
      }
    );

    // Registrar horas trabajadas
    router.post("/:id/horas", 
      AuthMiddleware.authorize("empleado", "administrador"), 
      async (req, res) => {
        const { id } = req.params;
        const { horasTrabajadas } = req.body;
        try {
          await Task.findByIdAndUpdate(id, { horasTrabajadas });
          res.redirect("back");
        } catch (err) {
          console.error("Error al registrar horas:", err);
          res.status(500).send("Error al registrar horas trabajadas");
        }
      }
    );

    // ========== RUTAS API (JSON) ==========
    router.post("/", TaskController.create);
    router.put("/:id", TaskController.update);
    router.delete("/:id", TaskController.deleteById);
    
    // ========== RUTAS GENERALES AL FINAL ==========
    router.get("/:id", TaskController.getById);
    router.get("/", TaskController.getAll);

    return router;
  }
}

export default TaskRoutes;