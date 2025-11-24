import mongoose from "mongoose";
import { Task } from "../models/Task.model.js";
import { Project } from "../models/Project.model.js";
import { Employee } from "../models/Employee.model.js";
import { Client } from "../models/Client.model.js";

export class TaskService {
  // Listar todas las tareas
  static async getAll() {
    return await Task.find()
      .populate("project", "nombre estado")
      .populate("empleados", "nombre apellido rol")
      .populate("cliente", "nombre apellido email");
  }

  // Tareas por proyecto
  static async getByProject(projectId) {
    if (!mongoose.Types.ObjectId.isValid(projectId))
      throw new Error("ID de proyecto inválido");

    const tasks = await Task.find({ project: projectId })
      .populate("empleados", "nombre apellido rol")
      .populate("project", "nombre estado")
      .populate("cliente", "nombre apellido email")
      .lean();

    return tasks;
  }

  // Obtener una tarea por ID
  static async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error("ID de tarea inválido");

    const task = await Task.findById(id)
      .populate("project", "nombre estado")
      .populate("empleados", "nombre apellido rol")
      .populate("cliente", "nombre apellido email");

    if (!task) throw new Error("Tarea no encontrada");
    return task;
  }

  // Crear tarea
  static async create(data) {
    const project = await Project.findById(data.project);
    if (!project) throw new Error("Proyecto no encontrado");

    if (data.cliente) {
      const client = await Client.findById(data.cliente);
      if (!client) throw new Error("Cliente no encontrado");
    }

    if (data.empleados && data.empleados.length > 0) {
      const validEmployees = await Employee.find({ _id: { $in: data.empleados } });
      if (validEmployees.length !== data.empleados.length)
        throw new Error("Uno o más empleados no existen");
    }

    if (data.horas < 0 || data.horasEstimadas < 0)
      throw new Error("Las horas no pueden ser negativas");

    const task = await Task.create({
      nombre: data.nombre,
      descripcion: data.descripcion,
      estado: data.estado,
      prioridad: data.prioridad,
      empleados: data.empleados,
      project: data.project,
      cliente: data.cliente,
      horasEstimadas: data.horasEstimadas,
      horas: data.horas,
    });

    // Agregar al proyecto
    project.tareas = project.tareas || [];
    project.tareas.push(task._id);
    await project.save();

    return task;
  }

  static async getByEmployee(employeeId) {
  return await Task.find({ empleados: employeeId })
    .populate("project", "nombre estado")
    .populate("cliente", "nombre apellido email");
  }
  
  // Actualización parcial o total
  static async update(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID inválido");

    const task = await Task.findById(id);
    if (!task) throw new Error("Tarea no encontrada");

    if (data.estado === "finalizada" && !task.fechaFin)
      data.fechaFin = new Date();

    const updated = await Task.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    return updated;
  }

  // Eliminar tarea 
  static async deleteById(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error("ID inválido");

    const task = await Task.findById(id);
    if (!task) throw new Error("Tarea no encontrada");

    if (task.estado !== "pendiente")
      throw new Error("Solo se pueden eliminar tareas pendientes");

    await task.deleteOne();
    return { message: "Tarea eliminada correctamente" };
  }
}

