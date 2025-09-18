
import { Project } from "../models/Project.model.js";

export class ProjectService {
  static async getAll() {
    return await Project.find()
      .populate("clientId", "nombre apellido email")
      .populate("employees", "nombre apellido email rol area");
  }

  static async create(data) {
    return await Project.create(data);
  }
}