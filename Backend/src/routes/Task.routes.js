import { Router } from "express";
import { TaskController } from "../controllers/Task.controller.js";
import { TaskValidator } from "../middlewares/validators/task.validator.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js";
import { Passport } from "../config/Passport.config.js";

class TaskRoutes {
  static getRouter() {
    const router = Router();

    const auth = [Passport.authenticate(), AuthMiddleware.authorize("administrador", "empleado")];

    // ========== RUTAS ESPECÍFICAS PRIMERO ==========
    router.get('/project/:projectId', auth, TaskController.getByProject);
    router.get("/view/list", auth, TaskController.renderList);

    // ========== RUTAS DASHBOARD (POST forms) ==========
    router.post("/save", auth, TaskController.save);
    router.post("/update/:id", auth, TaskController.updateTask);
    router.post("/:id/estado", auth, TaskController.updateEstado);
    router.post("/:id/horas", auth, TaskController.updateHoras);

    // ========== RUTAS API REST ==========
    router.get("/", auth, TaskController.getAll);
    router.get("/:id", auth, TaskController.getById);
    router.post("/", auth, TaskValidator.validateCreate, TaskController.create);
    router.put("/:id", auth, TaskValidator.validateUpdate, TaskController.update);
    router.delete("/:id", auth, TaskController.deleteById);

    return router;
  }
}

export default TaskRoutes;