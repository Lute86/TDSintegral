import { Router } from "express";
import { ContactController } from "../controllers/Contact.controller.js";
import { ContactValidator } from "../middlewares/validators/contact.validator.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js";
import { Passport } from "../config/Passport.config.js";

class ContactRoutes {
  static getRouter() {
    const router = Router();

    // Ruta pública para crear consulta desde landing
    router.post("/", ContactValidator.validateCreate, ContactController.create);

    // Rutas protegidas para admin
    const authAdmin = [Passport.authenticate(), AuthMiddleware.authorize("administrador")];

    router.get("/", authAdmin, ContactController.getAll);
    router.get("/:id", authAdmin, ContactController.getById);
    router.post("/:id/estado", authAdmin, ContactValidator.validateUpdateEstado, ContactController.updateEstado);
    router.delete("/:id", authAdmin, ContactController.deleteById);

    return router;
  }
}

export default ContactRoutes;