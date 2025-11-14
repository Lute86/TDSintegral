import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Client } from "./src/models/Client.model.js";
import { Employee } from "./src/models/Employee.model.js";
import { Project } from "./src/models/Project.model.js";
import { Task } from "./src/models/Task.model.js";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB para seed");

    // Limpiar colecciones
    await Promise.all([
      Client.deleteMany({}),
      Employee.deleteMany({}),
      Project.deleteMany({}),
      Task.deleteMany({})
    ]);

    console.log("Colecciones limpiadas");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("admin", saltRounds);

    // ===== Clientes =====
    const clients = await Client.insertMany([
      {
        nombre: "Juan",
        apellido: "Pérez",
        email: "juan.perez@example.com",
        telefono: "111111111",
        consulta: "Quiero un sistema de gestión"
      }
    ]);

    console.log(`Clientes creados: ${clients.length}`);

    // ===== Empleados =====
    const employees = await Employee.insertMany([
      {
        nombre: "admin",
        apellido: "Garcia",
        email: "admin@admin.com",
        telefono: "444444444",
        rol: "administrador",
        area: "Contenidos",
        password: hashedPassword
      },
      {
        nombre: "empleado",
        apellido: "Martinez",
        email: "empleado@empleado.com",
        telefono: "555555555",
        rol: "empleado", 
        area: "Social Media",
        password: hashedPassword
      },
       {
        nombre: "empleado2",
        apellido: "Martinez3",
        email: "empleado1@empleado.com",
        telefono: "42342342",
        rol: "empleado", 
        area: "Social Media",
        password: hashedPassword
      }
    ]);

    console.log(`Empleados creados: ${employees.length}`);

    // ===== Proyectos =====
    const projects = await Project.insertMany([
      {
        nombre: "Sistema de Gestión Comercial",
        clienteId: clients[0]._id,
        empleados: [employees[1]._id, ], 
        estado: "pendiente",
        metricas: { horasCotizadas: 50 },
        pago: { monto: 12000, status: "pendiente", metodo: "transferencia" }
      },
      {
        nombre: "Sistema de pago",
        clienteId: clients[0]._id,
        empleados: [employees[1]._id], 
        estado: "pendiente",
        metricas: { horasCotizadas: 50 },
        pago: { monto: 12000, status: "pendiente", metodo: "transferencia" }
      }
      ,
      {
        nombre: "Sistema de conteo",
        clienteId: clients[0]._id,
        empleados: [employees[2]._id], 
        estado: "pendiente",
        metricas: { horasCotizadas: 50 },
        pago: { monto: 12000, status: "pendiente", metodo: "transferencia" }
      }
    ]);

    console.log(`Proyectos creados: ${projects.length}`);

    // ===== Tareas =====
    const tasks = await Task.insertMany([
      {
        nombre: "Diseñar interfaz de login",
        descripcion: "Crear pantalla de inicio de sesión y validación de usuario",
        estado: "en proceso",
        prioridad: "alta",
        fechaInicio: new Date("2025-11-01"),
        empleados: [employees[1]._id],
        project: projects[0]._id,
        cliente: clients[0]._id,
        horasEstimadas: 20,
        horas: 10
      },
      {
        nombre: "Configurar base de datos",
        descripcion: "Crear esquema inicial en MongoDB y relaciones",
        estado: "pendiente",
        prioridad: "media",
        empleados: [employees[1]._id],
        project: projects[0]._id,
        cliente: clients[0]._id,
        horasEstimadas: 15
      },
      {
        nombre: "crear conteo",
        descripcion: "conteo",
        estado: "pendiente",
        prioridad: "media",
        empleados: [employees[2]._id],
        project: projects[1]._id,
        cliente: clients[0]._id,
        horasEstimadas: 15
      }
    ]);

    console.log(`Tareas creadas: ${tasks.length}`);

    console.log("Seed completado con éxito!");
    process.exit(0);
  } catch (err) {
    console.error("Error en seed:", err.message);
    process.exit(1);
  }
}

seed();
