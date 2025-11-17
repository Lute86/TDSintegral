import { Router } from "express";
import { ProjectController } from "../controllers/Project.controller.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js"

class ProjectRoutes {
  static getRouter() {
    const router = Router();
console.log(ProjectController)

    // --- vistas ---
    router.get("/list", AuthMiddleware.isAuthenticated, ProjectController.renderList);
    router.get("/view/new", AuthMiddleware.authorize("administrador"), ProjectController.renderNewForm);
    router.get("/view/edit/:id", AuthMiddleware.authorize("administrador"), ProjectController.renderEditForm);
    router.post("/view/save", AuthMiddleware.authorize("administrador"), ProjectController.save);
    router.get("/view/delete/:id", AuthMiddleware.authorize("administrador"), ProjectController.delete);

    // --- API JSON ---
    router.get("/", ProjectController.getAll);
    router.get("/:id", ProjectController.getById);
    router.post("/", ProjectController.create);
    router.put("/:id", ProjectController.update);
    router.delete("/:id", ProjectController.deleteById);
/*
    router.get("/projects", AuthMiddleware.isAuthenticated, ProjectController.renderList);
    router.get("/", ProjectController.getAll);
    router.get("/:id", ProjectController.getById);
    router.post("/", ProjectController.create);
    router.put("/:id", ProjectController.update);
    router.delete("/:id", ProjectController.deleteById);

//------------

router.get("/", ProjectController.list);
router.get("/new", ProjectController.showForm);
router.get("/edit/:id",AuthMiddleware.authorize("administrador", "empleado"), ProjectController.showForm);
router.post("/save", ProjectController.save);
router.get("/delete/:id", ProjectController.delete);



    // VISTA 
    router.get("/view/list",  AuthMiddleware.authorize("administrador", "empleado"), ProjectController.renderList
    );

    //
    // vista/CRUD pages (pug)
    router.get('/projects', AuthMiddleware.isAuthenticated, ProjectController.renderList); // view list
    router.get('/new', AuthMiddleware.authorize('administrador'), ProjectController.renderNewForm);
    router.get('/:id/edit', AuthMiddleware.authorize('administrador'), ProjectController.renderEditForm);

    // Protege la ruta
    router.get("/mis-proyectos",AuthMiddleware.authorize("administrador", "empleado"),ProjectController.renderList
    );
    router.get("/projects",AuthMiddleware.isAuthenticated, ProjectController.renderList    
    );

  
  */
    return router;
  }
}
export default ProjectRoutes;
