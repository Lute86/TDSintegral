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
    router.post("/:id/updateEstado", AuthMiddleware.authorize("empleado", "administrador"), async (req, res) => {
      const { id } = req.params;
      const { estado } = req.body;
      try {
        await Task.findByIdAndUpdate(id, { estado });
        res.redirect("back"); // redirige al dashboard anterior
      } catch (err) {
        res.status(500).send("Error al actualizar estado");
      }
    });

    router.post("/:id/horas", AuthMiddleware.authorize("empleado", "administrador"), async (req, res) => {
      const { id } = req.params;
      const { horasTrabajadas } = req.body;
      try {
        await Task.findByIdAndUpdate(id, { horasTrabajadas });
        res.redirect("back");
      } catch (err) {
        res.status(500).send("Error al registrar horas trabajadas");
      }
    });
        return router;
      }
    }

export default TaskRoutes;
