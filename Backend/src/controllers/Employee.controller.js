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
    return []; // o lanzar error si querés que la vista lo maneje
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
    static async dashboardCreate(req, res) {
  try {
    await Employee.create({ nombre: req.body.nombre, email: req.body.email });
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).send('Error al crear empleado');
  }
}

    static async edit(req, res) {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).send('Empleado no encontrado');
    res.render('edit', { employee });
  } catch (error) {
    res.status(500).send('Error al cargar formulario de edición');
  }
}

    static async dashboardUpdate(req, res) {
  try {
    await Employee.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).send('Error al actualizar empleado');
  }
}

    static async dashboardDelete(req, res) {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).send('Error al eliminar empleado');
  }
}


    

}

