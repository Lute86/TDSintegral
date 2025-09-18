import HttpResponse from "../utils/HttpResponse.utils.js";
import { EmployeeService } from "../services/Employee.service.js";

export class EmployeeController{
    static async getAll(req, res){
        try {
            const employees = await EmployeeService.getAll();
            return HttpResponse.success(res, employees);
        } catch (error) {
            return HttpResponse.serverError();
        }
    }

    static async getById(req, res){
        try {
            const { id } = req.params;
            const employee = await EmployeeService.getById(id);
            return HttpResponse.success(res, employee);
        } catch (error) {
            return HttpResponse.forbidden(res);
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
   static async getAllRaw() {
  try {
    return await EmployeeService.getAll();
  } catch (error) {
    console.error('Error en getAllRaw:', error);
    return []; // o lanzar error si querés que la vista lo maneje
  }
}


}


