import { Router } from "express";
import { TaskController } from "../controllers/Task.controller.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js";

class TaskRoutes {
  static getRouter() {
    const router = Router();

    router.get("/", TaskController.getAll);
    router.get("/:id", TaskController.getById);
    router.post("/", TaskController.create);
    router.put("/:id", TaskController.update);
   // router.put('/:id', TaskController.updatePut);
    router.delete("/:id", TaskController.deleteById);

// extra: tareas por proyecto (usado por JS)
router.get('/project/:projectId', TaskController.getByProject); 
     // VISTA 
    router.get("/view/list", 
      AuthMiddleware.authorize("administrador", "empleado"),
      TaskController.renderList
    );

    return router;
  }
}

export default TaskRoutes;
