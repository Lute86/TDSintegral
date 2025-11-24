import mongoose from "mongoose";


const employeeSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String }, // , required: true
  rol: { type: String, enum: ["administrador", "consultor", "supervisor", "empleado"] }, // , required: true
  area: { type: String, enum: ["SEO/SEM", "Social Media", "Contenidos", "Administración"] }, 
  email: { type: String, required: true, unique: true },
  telefono: { type: String }, // , required: true
  password: { type: String }, // , required: true
  proyectos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  tareas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }]
}, { timestamps: true });

export const Employee = mongoose.model("Employee", employeeSchema);
