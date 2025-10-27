import { Router } from "express";
import { TaskController } from "../controllers/Task.controller.js";

const router = Router();

router.get("/", TaskController.getAll);
router.get("/:id", TaskController.getById);
router.get("/project/:projectId", TaskController.getByProject);
router.get("/employee/:employeeId", TaskController.getByEmployee);
router.post("/", TaskController.create);
router.put("/:id", TaskController.update);
router.delete("/:id", TaskController.delete);

export default router;
