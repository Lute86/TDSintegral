import { Employee } from "../models/Employee.model.js";

export class EmployeeService {
  static async getAll() {
    return await Employee.find();
  }

  static async getById(id) {
    const employee = await Employee.findById(id);
    if (!employee) throw new Error("Empleado no encontrado");
    return employee;
  }

  static async create(data) {
    return await Employee.create(data);
  }
}
