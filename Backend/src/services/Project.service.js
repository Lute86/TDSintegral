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
    // CORREGIDO: En el service, si el ID es inválido, devolvemos null o CastError
    // Aquí permitimos que Mongoose lance el CastError si el ID no es válido para ObjectId,
    // pero si la búsqueda no arroja resultados, simplemente retorna un array vacío.
    if (!mongoose.Types.ObjectId.isValid(employeeId))
      throw new Error("ID de empleado inválido");

    return await Project.find({ empleados: employeeId })
      .populate("clienteId", "nombre apellido email")
      .populate("empleados", "nombre apellido rol area email");
  }

  // Obtener un proyecto por ID
  static async getById(id) {
    // Si el ID no es válido, devolvemos null para que el controlador lo maneje como 404.
    if (!mongoose.Types.ObjectId.isValid(id))
      return null;

    const project = await Project.findById(id)
      .populate("clienteId", "nombre apellido email")
      .populate("empleados", "nombre apellido rol area email");

    // CORREGIDO: Devolver null si no se encuentra, en lugar de lanzar un Error.
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

  // Actualizar completamente (PUT)
  static async updatePut(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const updated = await Project.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    // CORREGIDO: Devolver null si no se encuentra.
    return updated;
  }

  // Actualización parcial (PATCH, usado también por el controlador HTML)
  static async update(id, data) {
    // 1. Validar el ID
    // CORREGIDO: Devolver null si el ID es inválido.
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null; 
    }
    
    // 2. Ejecutar la actualización con $set
    const updated = await Project.findByIdAndUpdate(
        id, 
        { $set: data }, 
        { 
            new: true, 
            runValidators: true, 
        }
    )
    .lean(); 

    // 3. Verificar y devolver
    // CORREGIDO: Devolver null si no se encuentra, en lugar de lanzar un Error simple.
    return updated;
  }

  //  Eliminar proyecto junto con sus tareas
  static async deleteById(id) {
    // ID inválido, devolver null.
    if (!mongoose.Types.ObjectId.isValid(id)) return null; 

    // 1. Buscar el proyecto para verificar existencia
    const project = await Project.findById(id);
    
    // CORREGIDO: Devolver null si no se encuentra.
    if (!project) return null; 

    //  Borra TODAS las tareas del proyecto 
    await Task.deleteMany({ project: id });

    //  Luego elimina el proyecto
    await project.deleteOne();

    return { message: "Proyecto y todas sus tareas eliminadas correctamente" };
  }
}