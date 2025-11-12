/*import { Router } from "express";
import { EmployeeController } from "../controllers/Employee.controller.js";
import methodOverride from "method-override";
import { EmployeeValidator } from "../middlewares/validators/employee.validator.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js";

const auth = [AuthMiddleware.authorize("administrador", "supervisor")];

 class EmployeeRoutes{
    
    static getRouter(){
        const router = Router();
        //rutas
        router.get('/profiles', auth, EmployeeController.getAll)
        router.get('/myprofile/:id', EmployeeController.getById)
        router.post('/register', auth, EmployeeValidator.validateCreate, EmployeeController.create)
        router.put('/myprofile/:id', EmployeeController.updatePut)
        router.patch('/myprofile/:id', EmployeeController.update)
        router.delete('/employee/:id', EmployeeController.deleteById); 
// REST
      router.post('/profiles', EmployeeController.create);
    
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
*/
import { Router } from "express";
import { EmployeeController } from "../controllers/Employee.controller.js";
import { EmployeeValidator } from "../middlewares/validators/employee.validator.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js";

const auth = [AuthMiddleware.authorize("administrador", "supervisor", "empleado")];

class EmployeeRoutes {
  static getRouter() {
    const router = Router();

    // --- API REST ---
    router.get('/profiles',  EmployeeController.getAll);//auth,
    router.get('/myprofile/:id', EmployeeController.getById);
    router.post('/register', EmployeeValidator.validateCreate, EmployeeController.create);//auth,
    router.put('/myprofile/:id', EmployeeController.updatePut);
    router.patch('/myprofile/:id', EmployeeController.update);
    router.delete('/employee/:id', EmployeeController.deleteById);
    router.post('/profiles', EmployeeController.create);


// vistas admin
//router.get('/admin/empleados', AuthMiddleware.authorize('administrador'), EmployeeController.renderList);
//router.get('/admin/empleados/new', AuthMiddleware.authorize('administrador'), EmployeeController.renderNewForm);
//router.get('/admin/empleados/:id/edit', AuthMiddleware.authorize('administrador'), EmployeeController.renderEditForm);



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
