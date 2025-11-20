import { Task } from "../models/Task.model.js";
import { Project } from "../models/Project.model.js";
import { Employee } from "../models/Employee.model.js";

export class TaskController {
  static async getAll(req, res) {
    try {
      const tasks = await Task.find()
        .populate('project')
        .populate('empleados');
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const task = await Task.findById(req.params.id)
        .populate('project')
        .populate('empleados');
      if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getByProject(req, res) {
    try {
      const tasks = await Task.find({ project: req.params.projectId })
        .populate('empleados');
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const task = new Task(req.body);
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async save(req, res) {
    try {
      const { 
        nombre, 
        descripcion, 
        estado, 
        prioridad, 
        fechaInicio, 
        fechaFin, 
        horasEstimadas, 
        project,
        empleados
      } = req.body;
      
      // Convertir empleados a array si viene como string único
      let empleadosArray = [];
      if (empleados) {
        empleadosArray = Array.isArray(empleados) ? empleados : [empleados];
      }
      
      const task = new Task({
        nombre,
        descripcion,
        estado,
        prioridad,
        fechaInicio,
        fechaFin,
        horasEstimadas,
        project,
        empleados: empleadosArray,
        horas: 0
      });
      
      await task.save();
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error al guardar tarea:', error);
      res.status(500).send('Error al crear la tarea');
    }
  }

  static async update(req, res) {
    try {
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, estado, project, empleados } = req.body;
      
      // Convertir empleados a array si viene como string único
      let empleadosArray = [];
      if (empleados) {
        empleadosArray = Array.isArray(empleados) ? empleados : [empleados];
      }
      
      await Task.findByIdAndUpdate(id, {
        nombre,
        descripcion,
        estado,
        project,
        empleados: empleadosArray
      });
      
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      res.status(500).send('Error al actualizar la tarea');
    }
  }

  static async deleteById(req, res) {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }
      res.json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async renderList(req, res) {
    try {
      const tasks = await Task.find()
        .populate('project')
        .populate('empleados')
        .lean();
      
      const projects = await Project.find().lean();
      const employees = await Employee.find().lean();
      
      res.render('tasks/list', {
        tasks,
        projects,
        employees,
        user: req.session.user
      });
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      res.status(500).send('Error al cargar las tareas');
    }
  }
}