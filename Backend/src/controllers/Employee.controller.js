import { EmployeeService } from "../services/Employee.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";
import bcrypt from "bcryptjs";

export class EmployeeController {
  
  static async getAll(req, res) {
    try {
      const employees = await EmployeeService.getAll();
      HttpResponse.success(res, employees);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }

  static async getById(req, res) {
  try {
      const { id } = req.params;
      const employee = await EmployeeService.getById(id);

      if (!employee) {
      return HttpResponse.notFound(res, `Empleado con ID ${id} no encontrado`);
      }

      return HttpResponse.success(res, employee);
  } catch (error) {
      return HttpResponse.serverError(res, error.message);
  }
  }

   static async getAllRaw() {
    try {
      return await EmployeeService.getAll();
    } catch (error) {
      console.error('Error en getAllRaw:', error);
      return []; 
    }

  }  
  
  static async create(req, res){
      try {
          const { password, ...employeeData } = req.body;
          if (!password) {
              throw new Error("Datos incompletos");
          }
          // Encriptar password
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          const newEmployeeData = { ...employeeData, password: hashedPassword };
          const newEmployee = await EmployeeService.create(newEmployeeData);
          if (newEmployee) return HttpResponse.created(res, {email: newEmployee.email, rol: newEmployee.rol});
      } catch (error) {
          if (error.message === "Datos incompletos") {
              return HttpResponse.badRequest(res, "Faltan datos requeridos");
          }
          if (error.message === "Email ya existe") {
              return HttpResponse.conflict(res, "El email ya está registrado");
          }
          return HttpResponse.serverError(res);
      }
  }

  static async updatePut(req, res){
      try {
          const { id } = req.params;
          const employeeData = req.body;
          const updatedEmployee = await EmployeeService.updatePut(id, employeeData);
          return HttpResponse.success(res, updatedEmployee);
      } catch (error) {
          if (error.message === "No autorizado") {
              return HttpResponse.forbidden(res);
          }
          if (error.message === "Empleado no encontrado") {
              return HttpResponse.notFound(res, "Empleado no encontrado");
          }
          if (error.message === "Datos incompletos") {
              return HttpResponse.badRequest(res, "Faltan datos requeridos");
          }
          if (error.message === "Email ya existe") {
              return HttpResponse.conflict(res, "El email ya está registrado");
          }
          return HttpResponse.serverError(res);
      }
  }

        
  static async update(req, res) { 
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedEmployee = await EmployeeService.update(id, updateData);
      return HttpResponse.success(res, updatedEmployee);
    } catch (error) {
      if (error.message === "No autorizado") {
        return HttpResponse.forbidden(res);
      }
      if (error.message === "Empleado no encontrado") {
        return HttpResponse.notFound(res, "Empleado no encontrado");
      }
      return HttpResponse.serverError(res);
    }
  }

    
  static async deleteById(req, res) { // Controlador DELETE
  try {
      const { id } = req.params;
      const deleted = await EmployeeService.deleteById(id);

      if (!deleted) {
          return HttpResponse.notFound(res, `Empleado con ID ${id} no existe`);
      }

      return HttpResponse.success(res, {
          message: `Empleado con ID ${id} eliminado`,
          data: deleted
      });
  } catch (error) {
      return HttpResponse.serverError(res, error.message); 
  }         
  }


  // Métodos para vistas del administrador 

  static async getAllEmployees() {
    const empleados = await Employee.find().lean();
    return empleados;
  }


  static async renderAdminList(req, res) {
    try {
      const employees = await EmployeeService.getAll();
      if (req.headers["x-requested-with"] === "XMLHttpRequest") {
        res.render("employee/list", { employees, layout: false });
      } else {
        res.render("dashboardempleados", { employees, user: req.user });
      }
    } catch (err) {
      console.error("Error al listar empleados:", err);
      res.status(500).send("Error al cargar empleados");
    }
  }

  //  Nuevo
  static async renderNewForm(req, res) {
    try {
      res.render("employee/form", {
        employee: null,
        actionUrl: "/employee/new",
      });
    } catch (err) {
      console.error("Error al renderizar formulario de creación:", err);
      res.status(500).send("Error al cargar formulario");
    }
  }

  static async createFromForm(req, res) {
    try {
      const { password, ...data } = req.body;
      if (!password) throw new Error("La contraseña es obligatoria");

      const hashed = await bcrypt.hash(password, 10);
      const nuevo = await EmployeeService.create({ ...data, password: hashed });

      // Devuelve JSON para que lo maneje el fetch del iframe
      res.json({ success: true, empleado: nuevo });
    } catch (err) {
      console.error("Error al crear empleado:", err);
      res.status(400).json({ success: false, message: err.message });
    } 
  }


  //  Editar 
  static async renderEditForm(req, res) {
    try {
      const employee = await EmployeeService.getById(req.params.id);
      if (!employee) return res.status(404).send("Empleado no encontrado");
      res.render("employee/form", {
        employee,
        actionUrl: `/employee/edit/${employee._id}`,
      });
    } catch (err) {
      console.error("Error al cargar empleado:", err);
      res.status(404).send("Empleado no encontrado");
    }
  }

  static async updateFromForm(req, res) {
  try {
    const { password, ...data } = req.body;
    if (!password) delete data.password;
    else data.password = await bcrypt.hash(password, 10);

    const actualizado = await EmployeeService.update(req.params.id, data);
    res.json({ success: true, empleado: actualizado });
  } catch (err) {
    console.error("Error al actualizar empleado:", err);
    res.status(400).json({ success: false, message: err.message });
  }
}

  //  Elimina empleado (petición fetch DELETE)
  static async deleteFromForm(req, res) {
    try {
      await EmployeeService.deleteById(req.params.id);
      res.status(200).json({ success: true });
    } catch (err) {
      console.error("Error al eliminar empleado:", err);
      res.status(400).json({ error: err.message });
    }
  }

  // DASHBOARD EMPLEADO
  
  static async renderDashboard(req, res) {
    try {
      const user = req.user;
      const proyectos = await EmployeeController.getEmployeeProjects(user.id);
      const tareas = await EmployeeController.getEmployeeTasks(user.id);
      const empleados = user.rol === "administrador" ? await EmployeeService.getAll() : [];

      res.render("dashboardempleados", {
        user,
        proyectos,
        tareas,
        empleados
      });
    } catch (error) {
      console.error("Error al renderizar dashboard:", error);
      res.status(500).send("Error al cargar dashboard");
    }
  }

  // Métodos auxiliares (si existen en tu service)
  static async getEmployeeProjects(employeeId) {
    try {
      return await EmployeeService.getProjectsByEmployee(employeeId);
    } catch {
      return [];
    }
  }

  static async getEmployeeTasks(employeeId) {
    try {
      return await EmployeeService.getTasksByEmployee(employeeId);
    } catch {
      return [];
    }
  }



}

