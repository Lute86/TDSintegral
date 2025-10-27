import { Task } from "../models/Task.model.js";

export class TaskService {
  static async getAll() {
    return await Task.find()
      .populate("projectId", "nombre estado")
      .populate("employeeId", "nombre apellido email rol");
  }

  static async getById(id) {
    return await Task.findById(id)
      .populate("projectId", "nombre estado")
      .populate("employeeId", "nombre apellido email rol");
  }

  static async getByProject(projectId) {
    return await Task.find({ projectId })
      .populate("projectId", "nombre estado")
      .populate("employeeId", "nombre apellido email rol");
  }

  static async getByEmployee(employeeId) {
    return await Task.find({ employeeId })
      .populate("projectId", "nombre estado")
      .populate("employeeId", "nombre apellido email rol");
  }

  static async create(data) {
    return await Task.create(data);
  }

  static async update(id, data) {
    return await Task.findByIdAndUpdate(id, data, { new: true })
      .populate("projectId", "nombre estado")
      .populate("employeeId", "nombre apellido email rol");
  }

  static async delete(id) {
    return await Task.findByIdAndDelete(id);
  }
}
