import { Router } from "express";
import { ProjectController } from "../controllers/Project.controller.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js"

class ProjectRoutes {
  static getRouter() {
    const router = Router();

    router.get("/projects", AuthMiddleware.isAuthenticated, ProjectController.renderList);
    router.get("/", ProjectController.getAll);
    router.get("/:id", ProjectController.getById);
    router.post("/", ProjectController.create);
    router.put("/:id", ProjectController.update);
    router.delete("/:id", ProjectController.deleteById);

    // VISTA 
    router.get("/view/list", 
      AuthMiddleware.authorize("administrador", "empleado"),
      ProjectController.renderList
    );

    //
    // vista/CRUD pages (pug)
router.get('/projects', AuthMiddleware.isAuthenticated, ProjectController.renderList); // view list
//router.get('/projects/new', AuthMiddleware.authorize('administrador'), ProjectController.renderNewForm);
//router.get('/projects/:id/edit', AuthMiddleware.authorize('administrador'), ProjectController.renderEditForm);

    // Protege la ruta
    router.get("/mis-proyectos",
      AuthMiddleware.authorize("administrador", "empleado"),
      ProjectController.renderList
    );
    router.get("/projects",
      AuthMiddleware.isAuthenticated, 
      ProjectController.renderList    
    );

  
  
    return router;
  }
}
export default ProjectRoutes;
