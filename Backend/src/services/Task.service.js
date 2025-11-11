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
/*
static async getByProject(projectId){
  return await Task.find({ project: projectId })
    .populate('empleados','nombre apellido')
    .populate('project','nombre')
    .lean();
}
*/
static async getByProject(projectId) {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("ID de proyecto inválido");
  }

  const tasks = await Task.find({ project: projectId })
    .populate("empleados", "nombre apellido")
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

  //  Crear una tarea
  static async create(data) {
    // Validar existencia de proyecto
    const project = await Project.findById(data.project);
    if (!project) throw new Error("Proyecto no encontrado");

    // Validar cliente 
    if (data.cliente) {
      const client = await Client.findById(data.cliente);
      if (!client) throw new Error("Cliente no encontrado");
    }

    // Validar empleados asignados
    if (data.empleados && data.empleados.length > 0) {
      const validEmployees = await Employee.find({ _id: { $in: data.empleados } });
      if (validEmployees.length !== data.empleados.length) {
        throw new Error("Uno o más empleados no existen");
      }
    }

    // Validar horas
    if (data.horas < 0 || data.horasEstimadas < 0) {
      throw new Error("Las horas no pueden ser negativas");
    }

    //  Crear tarea con nombre y descripción
    const task = await Task.create({
      nombre: data.nombre,
      descripcion: data.descripcion,
      estado: data.estado,
      prioridad: data.prioridad,
      empleados: data.empleados,
      project: data.project,
      cliente: data.cliente,
      horasEstimadas: data.horasEstimadas,
      horas: data.horas
    });

    // Vincular la tarea al proyecto (opcional)
    project.tareas = project.tareas || [];
    project.tareas.push(task._id);
    await project.save();

    return task;
  }

  //  Actualización completa (PUT)
  static async updatePut(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error("ID inválido");

    const task = await Task.findById(id);
    if (!task) throw new Error("Tarea no encontrada");

    // Validaciones similares a create()
    if (data.project) {
      const project = await Project.findById(data.project);
      if (!project) throw new Error("Proyecto no encontrado");
    }

    if (data.empleados && data.empleados.length > 0) {
      const validEmployees = await Employee.find({ _id: { $in: data.empleados } });
      if (validEmployees.length !== data.empleados.length) {
        throw new Error("Uno o más empleados no existen");
      }
    }

    // Actualiza incluyendo nombre/descripcion 
    const updated = await Task.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return updated;
  }

  // Actualización parcial (PATCH)
  static async update(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error("ID inválido");

    const task = await Task.findById(id);
    if (!task) throw new Error("Tarea no encontrada");

    // Si finaliza, registrar fechaFin
    if (data.estado === "finalizada" && !task.fechaFin) {
      data.fechaFin = new Date();
    }

    // Permitir actualizar nombre o descripcion
    const updated = await Task.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    return updated;
  }

  //  Borrar Tarea
  static async deleteById(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error("ID inválido");

    const task = await Task.findById(id);
    if (!task) throw new Error("Tarea no encontrada");

    // Evitar eliminar tareas en proceso o finalizadas
    if (task.estado !== "pendiente") {
      throw new Error("Solo se pueden eliminar tareas pendientes");
    }

    await task.deleteOne();
    return { message: "Tarea eliminada correctamente" };
  }
  
  static async getByProject(projectId) {
    return Task.find({ project: projectId }).populate("empleados project cliente");
  }

}
