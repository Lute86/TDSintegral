import { Router } from "express";
import { ContactController } from "../controllers/Contact.controller.js";

class ContactRoutes {
  static getRouter() {
    const router = Router();

    // Ruta pública para crear consulta desde landing
    router.post("/", ContactController.create);
    
    // Rutas protegidas para admin
    router.get("/", ContactController.getAll);
    router.post("/:id/estado", ContactController.updateEstado);
    router.delete("/:id", ContactController.deleteById);

    return router;
  }
}

export default ContactRoutes;