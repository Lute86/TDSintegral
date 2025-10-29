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
    // Validar email único
      const exists = await Employee.findOne({ email: data.email });
      if (exists) throw new Error("Email ya existe");
      return await Employee.create(data);
  }

  static async updatePut(id, data) {
    const employee = await Employee.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!employee) throw new Error("Empleado no encontrado");
    return employee;
  }

  static async update(id, data) {
    const employee = await Employee.findByIdAndUpdate(id, { $set: data }, {
      new: true,
      runValidators: true,
    });
    if (!employee) throw new Error("Empleado no encontrado");
    return employee;
  }

  static async deleteById(id) {
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) throw new Error("Empleado no encontrado");
    return employee;
  }
}
