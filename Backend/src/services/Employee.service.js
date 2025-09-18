import { Employee } from "../models/Employee.model.js"

export class EmployeeService{

    static employees = [
        new Employee(1, 'Ana'),
        new Employee(2, 'Juan')
    ];

    static async getAll (){
        try {
            return EmployeeService.employees.map(e => e.toJSON())
        } catch (error) {
            throw new Error("Error del servidor");
        }
    }

    static async getById(id){
        try {
            const employee = EmployeeService.employees.find(e => e.id == id);
            if (!employee) throw new Error("No autorizado");
            return employee.toJSON();
        } catch (error) {
            throw new Error("Error del servidor");
        }
    }
}