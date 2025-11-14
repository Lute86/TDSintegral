
import { Router } from "express";
import { EmployeeController } from "../controllers/Employee.controller.js";
import { EmployeeValidator } from "../middlewares/validators/employee.validator.js";
import { ClientValidator } from "../middlewares/validators/client.validator.js";


// /employee
class EmployeeRoutes {
  static getRouter() {
    const router = Router();

    // --- API REST ---
    router.get('/',  EmployeeController.getAll);//auth,
    router.get('/myprofile/:id', ClientValidator.validateIdType ,EmployeeController.getById);
    router.post('/register', EmployeeValidator.validateCreate, EmployeeController.create);//auth,
    router.put('/myprofile/:id', [ClientValidator.validateIdType, EmployeeValidator.validateUpdate], EmployeeController.updatePut);
    router.patch('/myprofile/:id', [ClientValidator.validateIdType, EmployeeValidator.validateUpdate], EmployeeController.update);
    router.delete('/:id', [ClientValidator.validateIdType], EmployeeController.deleteById);


    // --- VISTAS ---
    // Dashboard principal del empleado
    router.get('/dashboard', async (req, res) => {
      try {
        const proyectos = await EmployeeController.getEmployeeProjects(req.user.id);
        const tareas = await EmployeeController.getEmployeeTasks(req.user.id);

        res.render('dashboardempleados', {
          user: req.user,
          proyectos,
          tareas
        });
      } catch (error) {
        console.error("Error cargando dashboard:", error);
        res.status(500).send('Error al cargar el dashboard');
      }
    });

    // Mis proyectos
    router.get('/proyectos', async (req, res) => {
      const proyectos = await EmployeeController.getEmployeeProjects(req.user.id);
      res.render('proyectosEmpleado', { user: req.user, proyectos });
    });

    // Mis tareas
    router.get('/tareas', async (req, res) => {
      const tareas = await EmployeeController.getEmployeeTasks(req.user.id);
      res.render('tareasEmpleado', { user: req.user, tareas });
    });

    // Logout
    router.get('/logout', (req, res) => {
      res.clearCookie('token');
      res.redirect('/');
    });

    return router;
  }
}

export default EmployeeRoutes;
