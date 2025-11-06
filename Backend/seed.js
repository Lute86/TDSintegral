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
    console.log("✅ Conectado a MongoDB para seed");

    // Limpiar colecciones
    await Promise.all([
      Client.deleteMany({}),
      Employee.deleteMany({}),
      Project.deleteMany({}),
      Task.deleteMany({})
    ]);

    console.log("🧹 Colecciones limpiadas");

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

    console.log(`👤 Clientes creados: ${clients.length}`);

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
        rol: "consultor", // tu modelo no tiene "empleado" como rol válido
        area: "Social Media",
        password: hashedPassword
      }
    ]);

    console.log(`💼 Empleados creados: ${employees.length}`);

    // ===== Proyectos =====
    const projects = await Project.insertMany([
      {
        nombre: "Sistema de Gestión Comercial",
        clienteId: clients[0]._id,
        empleados: [employees[0]._id, employees[1]._id], // corregido índice
        estado: "pendiente",
        metricas: { horasCotizadas: 50 },
        pago: { monto: 12000, status: "pendiente", metodo: "transferencia" }
      }
    ]);

    console.log(`📁 Proyectos creados: ${projects.length}`);

    // ===== Tareas =====
    const tasks = await Task.insertMany([
      {
        estado: "en proceso",
        prioridad: "alta",
        fechaInicio: new Date("2025-11-01"),
        empleados: [employees[0]._id],
        proyect: projects[0]._id,
        cliente: clients[0]._id,
        horasEstimadas: 20,
        horas: 10
      },
      {
        estado: "pendiente",
        prioridad: "media",
        empleados: [employees[1]._id],
        proyect: projects[0]._id,
        cliente: clients[0]._id,
        horasEstimadas: 15
      }
    ]);

    console.log(`🧩 Tareas creadas: ${tasks.length}`);

    console.log("✅ Seed completado con éxito!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en seed:", err.message);
    process.exit(1);
  }
}

seed();
