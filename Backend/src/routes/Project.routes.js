import { Router } from "express";
import { ProjectController } from "../controllers/Project.controller.js";

const router = Router();

router.get("/", ProjectController.getAll);
router.post("/", ProjectController.create);

export default router;
