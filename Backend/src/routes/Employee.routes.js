import { Router } from "express";
import { EmployeeController } from "../controllers/Employee.controller.js";

const router = Router();
 
router.get("/", EmployeeController.getAll);
/*  router.post("/", EmployeeController.create);
*/
export default router;
