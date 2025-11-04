import { Router } from "express";
import { TaskController } from "../controllers/Task.controller.js";

class TaskRoutes {
  static getRouter() {
    const router = Router();

    router.get("/", TaskController.getAll);
    router.get("/:id", TaskController.getById);
    router.post("/", TaskController.create);
    router.put("/:id", TaskController.update);
    router.delete("/:id", TaskController.deleteById);

    return router;
  }
}

export default TaskRoutes;
