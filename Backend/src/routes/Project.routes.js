import { Router } from "express";
import { ProjectController } from "../controllers/Project.controller.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js"

class ProjectRoutes {
  static getRouter() {
    const router = Router();

    // ========== RUTAS ESPECÍFICAS PRIMERO (MUY IMPORTANTE EL ORDEN) ==========
    
    // VISTAS
    router.get("/projects", AuthMiddleware.isAuthenticated, ProjectController.renderList);
    router.get("/new", ProjectController.showForm);
    router.get("/edit/:id", ProjectController.showForm);
    router.get("/delete/:id", ProjectController.delete);
    router.get("/view/list", 
      AuthMiddleware.authorize("administrador", "empleado"),
      ProjectController.renderList
    );
    router.get("/mis-proyectos",
      AuthMiddleware.authorize("administrador", "empleado"),
      ProjectController.renderList
    );

    // ========== RUTAS DE FORMULARIOS (POST/PUT/DELETE) ==========
    router.post("/save", ProjectController.save);  // ← LA MÁS IMPORTANTE
    router.post("/update/:id", ProjectController.updateView);

    // ========== RUTAS API GENERALES AL FINAL ==========
    router.post("/", ProjectController.create);
    router.get("/:id", ProjectController.getById);
    router.get("/", ProjectController.list);  // ← Esta debe ir AL FINAL
    router.get("/", ProjectController.getAll); // ← Esta también AL FINAL
    router.delete("/:id", ProjectController.deleteById);

    return router;
  }
}
export default ProjectRoutes;