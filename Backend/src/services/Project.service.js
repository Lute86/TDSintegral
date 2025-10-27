import { Project } from "../models/Project.model.js";
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

    const project = await Project.findByIdAndDelete(id);
    if (!project) throw new Error("Proyecto no encontrado");

    return project;
  }

}

