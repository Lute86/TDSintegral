import { Router } from "express";
import { TaskController } from "../controllers/Task.controller.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js";

class TaskRoutes {
  static getRouter() {
    const router = Router();

    router.get("/", TaskController.getAll);        // listar todas las tareas (JSON)
    router.get("/:id", TaskController.getById);    // obtener una tarea por ID (JSON)
    router.post("/", TaskController.create);       // crear nueva tarea (JSON)
    router.put("/:id", TaskController.update);     // actualizar tarea (JSON)
    router.delete("/:id", TaskController.deleteById); // eliminar tarea (JSON)

 // === EXTRAS ===
    router.get("/project/:projectId", TaskController.getByProject);

    // === VISTAS PUG ===
    router.get("/view/list", AuthMiddleware.authorize("administrador", "empleado"),  TaskController.renderList);
    router.get("/view/new",AuthMiddleware.authorize("administrador"),TaskController.renderNewForm);
    router.get("/view/edit/:id", AuthMiddleware.authorize("administrador"),TaskController.renderEditForm);
    router.get("/delete/:id", AuthMiddleware.authorize("administrador"),TaskController.renderDeleteForm);

    // === ACCIONES POST ===
    router.post("/:id/updateEstado",AuthMiddleware.authorize("empleado", "administrador"),TaskController.updateEstado);
       
    
    return router;
      }
    }

export default TaskRoutes;
