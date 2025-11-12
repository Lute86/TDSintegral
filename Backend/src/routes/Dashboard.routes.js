import { Router } from "express";
import { DashboardController } from "../controllers/Dashboard.controller.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js";

const router = Router();

router.get(
  "/",
  AuthMiddleware.authorize("administrador", "empleado"),
  DashboardController.renderDashboard
);

export default router;
