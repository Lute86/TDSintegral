import mongoose from "mongoose";

// Roles: administrador, consultor, supervisor
// Áreas: SEO/SEM, Social Media, Contenidos, Administración

/*
const employeeSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String },
  rol: { type: String, enum: ["administrador", "consultor", "supervisor"], required: true },
  area: { type: String, enum: ["SEO/SEM", "Social Media", "Contenidos", "Administración"], required: true },
  password: { type: String, required: true }
}, { timestamps: true });
*/
const employeeSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String},
  email: { type: String, required: true, unique: true },
  telefono: { type: String },
  rol: { type: String, enum: ["administrador", "consultor", "supervisor"] },
  area: { type: String, enum: ["SEO/SEM", "Social Media", "Contenidos", "Administración"] },
  password: { type: String }
}, { timestamps: true });


export const Employee = mongoose.model("Employee", employeeSchema);