import mongoose from "mongoose";
import dotenv from "dotenv";
import { Client } from "./src/models/Client.model.js";
import { Employee } from "./src/models/Employee.model.js";
import { Project } from "./src/models/Project.model.js";
import { Task } from "./src/models/Task.model.js";
import bcrypt from "bcryptjs";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" Conectado a MongoDB para seed");

    // Limpiar colecciones
    await Client.deleteMany({});
    await Employee.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    console.log(" Colecciones limpiadas");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("password", saltRounds);

    // ===== Clientes =====
    const clients = await Client.insertMany([
      {
        nombre: "Juan",
        apellido: "Pérez",
        email: "juan.perez@example.com",
        telefono: "111111111",
        consulta: "Quiero un sistema de gestión"
      },
      {
        nombre: "María",
        apellido: "Gómez",
        email: "maria.gomez@example.com",
        telefono: "222222222",
        consulta: "Necesito una página web para mi negocio"
      },
      {
        nombre: "Carlos",
        apellido: "López",
        email: "carlos.lopez@example.com",
        telefono: "333333333",
        consulta: "Quiero asesoramiento en marketing digital"
      }
    ]);

    console.log(" Clientes creados:", clients.length);


    // ===== Empleados =====


    const employees = await Employee.insertMany([
      {
        nombre: "Ana",
        apellido: "Garcia",
        email: "ana.garcia@example.com",
        telefono: "444444444",
        rol: "administrador",
        area: "Contenidos",
        password: hashedPassword
      },
      {
        nombre: "Luis",
        apellido: "Martinez",
        email: "luis.martinez@example.com",
        telefono: "555555555",
        rol: "consultor",
        area: "Social Media",
        password: hashedPassword
      },
      {
        nombre: "Sofia",
        apellido: "Fernandez",
        email: "sofia.fernandez@example.com",
        telefono: "666666666",
        rol: "supervisor",
        area: "Administración",
        password: hashedPassword
      },
      {
        nombre: "Pedro",
        apellido: "Ramirez",
        email: "pedro.ramirez@example.com",
        telefono: "777777777",
        rol: "consultor",
        area: "SEO/SEM",
        password: hashedPassword
      }
    ]);

    console.log(" Empleados creados:", employees.length);



    // ===== Proyectos =====

    const projects = await Project.insertMany([
      {
        nombre: "Sistema de Gestión Comercial",
        clientId: clients[0]._id,
        employees: [employees[0]._id, employees[2]._id],
        estado: "pendiente",
        pago: { monto: 12000, status: "pendiente" }
      },
      {
        nombre: "Página Web Tienda Online",
        clientId: clients[1]._id,
        employees: [employees[1]._id, employees[2]._id],
        estado: "pendiente",
        pago: { monto: 8000, status: "pendiente" }
      },
      {
        nombre: "Campaña Marketing Digital",
        clientId: clients[2]._id,
        employees: [employees[0]._id, employees[3]._id],
        estado: "completado",
        pago: { monto: 5000, status: "pagado" }
      }
    ]);

    console.log(" Proyectos creados:", projects.length);

    console.log(" Seed completado con éxito!");
    process.exit(0);
  } catch (err) {
    console.error(" Error en seed:", err.message);
    process.exit(1);
  }
}

seed();
