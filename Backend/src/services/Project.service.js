/*import { Project } from "../models/Project.model.js";
import { Client } from "../models/Client.model.js";
import { Employee } from "../models/Employee.model.js";
import mongoose from "mongoose";

export class ProjectService {

  // Obtener todos los proyectos
  static async getAll() {
    return await Project.find()
      .populate("clienteId", "nombre apellido email")
      .populate("empleados", "nombre apellido rol area email");
      
  }

static async getByEmployee(employeeId) {
    try {
      // Ajustá este query según tu modelo
      const projects = await Project.find({ empleado: employeeId });
      return projects;
    } catch (error) {
      console.error("Error en ProjectService.getByEmployee:", error);
      throw error;
    }
  }

  // Obtener proyecto por ID
  static async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    const project = await Project.findById(id)
      .populate("clienteId", "nombre apellido email")
      .populate("empleados", "nombre apellido rol area email");
      
    if (!project) throw new Error("Proyecto no encontrado");
    return project;
  }

  // Crear un nuevo proyecto
  static async create(data) {
    // Verificar cliente existente
    const clientExists = await Client.findById(data.clienteId);
    if (!clientExists) throw new Error("El cliente especificado no existe");

    // Verificar empleados (si se envían)
    if (data.empleados && data.empleados.length > 0) {
      const validEmployees = await Employee.find({ _id: { $in: data.empleados } });
      if (validEmployees.length !== data.empleados.length)
        throw new Error("Uno o más empleados no existen");
    }

    const duplicate = await Project.findOne({nombre: data.nombre, clienteId: data.clienteId });
    if (duplicate) throw new Error("Ya existe un proyecto con este nombre para este cliente");


    const project = await Project.create(data);
    return project;
  }

  // Actualizar  (PUT)
  static async updatePut(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }
    const project = await Project.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!project) throw new Error("Proyecto no encontrado");
    return project;
  }

  // Actualización parcial (PATCH)
  static async update(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    const project = await Project.findByIdAndUpdate(id, { $set: data }, {
      new: true,
      runValidators: true,
    });

    if (!project) throw new Error("Proyecto no encontrado");
    return project;
  }

  // Eliminar proyecto
static async deleteById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    const project = await Project.findById(id);
    if (!project) throw new Error("Proyecto no encontrado");

    // ✅ Eliminar todas las tareas, sin validar estado
    await Task.deleteMany({ project: id });

    await project.deleteOne();
    return { message: "Proyecto y todas sus tareas eliminadas correctamente" };
  }

  static async deleteById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    const project = await Project.findByIdAndDelete(id);
    if (!project) throw new Error("Proyecto no encontrado");

    return project;
  }


}*/

import { Project } from "../models/Project.model.js";
import { Client } from "../models/Client.model.js";
import { Employee } from "../models/Employee.model.js";
import { Task } from "../models/Task.model.js"; 
import mongoose from "mongoose";

export class ProjectService {
  // Listar todos los proyectos
  static async getAll() {
    return await Project.find()
      .populate("clienteId", "nombre apellido email")
      .populate("empleados", "nombre apellido rol area email");
  }

  // Obtener proyectos asignados a un empleado
  static async getByEmployee(employeeId) {
    if (!mongoose.Types.ObjectId.isValid(employeeId))
      throw new Error("ID de empleado inválido");

    return await Project.find({ empleados: employeeId })
      .populate("clienteId", "nombre apellido email")
      .populate("empleados", "nombre apellido rol area email");
  }

  // Obtener un proyecto por ID
  static async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error("ID inválido");

    const project = await Project.findById(id)
      .populate("clienteId", "nombre apellido email")
      .populate("empleados", "nombre apellido rol area email");

    if (!project) throw new Error("Proyecto no encontrado");
    return project;
  }

  // Crear proyecto
  static async create(data) {
    const clientExists = await Client.findById(data.clienteId);
    if (!clientExists) throw new Error("El cliente especificado no existe");

    if (data.empleados && data.empleados.length > 0) {
      const validEmployees = await Employee.find({ _id: { $in: data.empleados } });
      if (validEmployees.length !== data.empleados.length)
        throw new Error("Uno o más empleados no existen");
    }

    const duplicate = await Project.findOne({
      nombre: data.nombre,
      clienteId: data.clienteId,
    });
    if (duplicate) throw new Error("Ya existe un proyecto con este nombre para este cliente");

    const project = await Project.create(data);
    return project;
  }

  // Actualizar completamente
  static async updatePut(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID inválido");

    const updated = await Project.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) throw new Error("Proyecto no encontrado");
    return updated;
  }

  // Actualización parcial
  static async update(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID inválido");

    const updated = await Project.findByIdAndUpdate(id, { $set: data }, {
      new: true,
      runValidators: true,
    });

    if (!updated) throw new Error("Proyecto no encontrado");
    return updated;
  }

  //  Eliminar proyecto junto con sus tareas
  static async deleteById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID inválido");

    const project = await Project.findById(id);
    if (!project) throw new Error("Proyecto no encontrado");

    //  Borra TODAS las tareas del proyecto 
    await Task.deleteMany({ project: id });

    //  Luego elimina el proyecto
    await project.deleteOne();

    return { message: "Proyecto y todas sus tareas eliminadas correctamente" };
  }

//----------------------------------------

 static async getAllWithTasks() {
    return await Project.find({
      include: [{ model: Task }],
      order: [["id", "ASC"]],
    });
  } 

  static async getById(id) {
    return await Project.findById(id, { include: [{ model: Task }] });
  }

  static async create(data) {
    return await Project.create(data);
  }

  static async update(id, data) {
    const project = await Project.findById(id);
    if (!project) throw new Error("Proyecto no encontrado");
    return await project.update(data);
  }

  static async delete(id) {
    const project = await Project.findById(id);
    if (!project) throw new Error("Proyecto no encontrado");
    await project.destroy();
  }

}

