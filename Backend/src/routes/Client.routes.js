import { Router } from "express";
import { ClientController } from "../controllers/Client.controller.js";
import { ClientValidator } from "../middlewares/validators/client.validator.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js";
import { Passport } from "../config/Passport.config.js";
const auth = [ClientValidator.validateUpdate ,Passport.authenticate(), AuthMiddleware.authorize("administrador", "supervisor")];

class ClientRoutes {
  static getRouter() {
    const router = Router();

    router.get("/", auth, ClientController.getAll);
    router.get("/:id", auth, ClientController.getById);
    router.post("/", ClientValidator.validateCreate, ClientController.create);
    router.put("/:id", auth, ClientController.update);
    router.delete("/:id", auth, ClientController.deleteById);

    return router;
  }
}

export default ClientRoutes;

