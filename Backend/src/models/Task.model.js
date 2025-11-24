import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  estado: { type: String, enum: ["pendiente", "en proceso", "finalizada"], default: "pendiente" },
  fechaInicio: { type: Date },
  fechaFin: { type: Date },
  prioridad: { type: String, enum: ["alta", "media", "baja"], default: "media" },
  empleados: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true }, 
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  horasEstimadas: { type: Number, default: 0 },
  horas: { type: Number, default: 0 }
}, { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);

