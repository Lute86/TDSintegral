import { Router } from "express";
import { ClientController } from "../controllers/Client.controller.js";

const router = Router();

router.get("/", ClientController.getAll);
/* router.post("/", ClientController.create);  */

export default router;
