
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


// --- Rutas vistas del administrador ---
//  Listado de empleados (vista principal)
router.get("/", AuthMiddleware.authorize("administrador"), EmployeeController.renderAdminList);

//  Formulario de creación
router.get(  "/new",  AuthMiddleware.authorize("administrador"),  EmployeeController.renderNewForm);

//  Crear empleado desde el formulario (POST clásico o AJAX)
router.post( "/new",  AuthMiddleware.authorize("administrador"), EmployeeController.createFromForm);

//  Formulario de edición
router.get( "/edit/:id", AuthMiddleware.authorize("administrador"), EmployeeController.renderEditForm);

//  Actualizar empleado desde el formulario
router.post( "/edit/:id", AuthMiddleware.authorize("administrador"), EmployeeController.updateFromForm);

//  Eliminar empleado (POST tradicional o fetch)
router.delete( "/delete/:id", AuthMiddleware.authorize("administrador"), EmployeeController.deleteFromForm);

// 🔁 Ruta para recargar lista parcial (AJAX)
router.get("/list", AuthMiddleware.authorize("administrador"), async (req, res) => {
  try {
    const empleados = await EmployeeController.getAllEmployees(); // asegurate que exista este método o usa el de tu controller
    res.render("employee/list", { empleados, layout: false });
  } catch (err) {
    console.error("Error al recargar empleados:", err);
    res.status(500).send("Error al cargar empleados");
  }
});
//   VISTA DEL EMPLEADO (Dashboard)

router.get( "/dashboard",AuthMiddleware.authorize(["empleado", "administrador"]), EmployeeController.renderDashboard);

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
