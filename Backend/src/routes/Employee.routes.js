import { Router } from "express";
import { EmployeeController } from "../controllers/Employee.controller.js";

class EmployeeRoutes {
  static getRouter() {
    const router = Router();

    // REST
    router.get('/profiles', EmployeeController.getAll);
    router.get('/myprofile/:id', EmployeeController.getById);
    router.post('/profiles', EmployeeController.create);
    router.put('/myprofile/:id', EmployeeController.updatePut);
    router.patch('/myprofile/:id', EmployeeController.update);
    router.delete('/employee/:id', EmployeeController.deleteById);

    // Visual dashboard

    router.get('/', (req, res) => {
    res.redirect('/dashboard');
    });

    router.get('/dashboard', async (req, res) => {
      try {
        const employees = await EmployeeController.getAllRaw();
        res.render('index', { employees });
      } catch (error) {
        res.status(500).send('Error al cargar el dashboard');
      }
    });

    router.post('/dashboard/employee', EmployeeController.dashboardCreate);
    router.get('/dashboard/employee/:id/edit', EmployeeController.edit);
    router.put('/dashboard/employee/:id', EmployeeController.dashboardUpdate);
    router.delete('/dashboard/employee/:id', EmployeeController.dashboardDelete);

    return router;
  }
}

export default EmployeeRoutes;
