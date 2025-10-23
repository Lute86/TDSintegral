import { Router } from "express";
import { ClientController } from "../controllers/Client.controller.js";

class ClientRoutes {
  static getRouter() {
    const router = Router();
    
    router.get("/", ClientController.getAll);
    router.get("/:id", ClientController.getById);
    router.post("/", ClientController.create);
    router.put("/:id", ClientController.update);
    router.delete("/:id", ClientController.deleteById);

    return router;
  }
}

export default ClientRoutes;
