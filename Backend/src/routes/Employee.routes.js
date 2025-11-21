import { Router } from "express";
import { EmployeeController } from "../controllers/Employee.controller.js";
import { EmployeeValidator } from "../middlewares/validators/employee.validator.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js";
import { Passport } from "../config/Passport.config.js";

class EmployeeRoutes {
  static getRouter() {
    const router = Router();

    const auth = [Passport.authenticate(), AuthMiddleware.authorize("administrador", "supervisor")];
    const authAdmin = [Passport.authenticate(), AuthMiddleware.authorize("administrador")];

    // ========== RUTAS DASHBOARD (POST forms) ==========
    router.post('/save', authAdmin, EmployeeController.save);
    router.post('/update/:id', authAdmin, EmployeeController.updateEmployee);

    // ========== RUTAS API REST ==========
    router.get('/profiles', auth, EmployeeController.getAll);
    router.get('/myprofile/:id', EmployeeController.getById);
    router.post('/register', auth, EmployeeValidator.validateCreate, EmployeeController.create);
    router.put('/myprofile/:id', auth, EmployeeController.updatePut);
    router.patch('/myprofile/:id', auth, EmployeeController.update);
    router.delete('/:id', authAdmin, EmployeeController.deleteById);

    return router;
  }
}

export default EmployeeRoutes;