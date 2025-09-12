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
}
