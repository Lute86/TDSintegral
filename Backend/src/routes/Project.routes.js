import { Router } from "express";
import { ProjectController } from "../controllers/Project.controller.js";

class ProjectRoutes {
  static getRouter() {
    const router = Router();
    
    router.get("/", ProjectController.getAll);
    router.get("/:id", ProjectController.getById);
    router.post("/", ProjectController.create);
    router.put("/:id", ProjectController.update);
    router.delete("/:id", ProjectController.deleteById);

    return router;
  }
}
export default ProjectRoutes;
