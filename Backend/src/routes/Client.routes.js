import { Router } from "express";
import { ClientController } from "../controllers/Client.controller.js";
import { ClientValidator } from "../middlewares/validators/client.validator.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js";
import { Passport } from "../config/Passport.config.js";
const auth = [Passport.authenticate(), AuthMiddleware.authorize("administrador", "supervisor")];

// /client
class ClientRoutes {
  static getRouter() {
    const router = Router();

    router.get("/", auth, ClientController.getAll);
    router.get("/:id", [ClientValidator.validateIdType, auth], ClientController.getById);
    router.post("/", ClientValidator.validateCreate, ClientController.create);
    router.put("/:id", [ClientValidator.validateIdType, ClientValidator.validateUpdate , auth], ClientController.update);
    router.delete("/:id", [ClientValidator.validateIdType, auth], ClientController.deleteById);

    return router;
  }
}

export default ClientRoutes;

