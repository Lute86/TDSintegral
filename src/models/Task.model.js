import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  estado: { type: String, enum: ["pendiente", "en_progreso", "completada"], default: "pendiente" },
  prioridad: { type: String, enum: ["baja", "media", "alta"], default: "media" },
  fechaInicio: { type: Date },
  fechaFin: { type: Date },
  horasEstimadas: { type: Number },
  horasReales: { type: Number, default: 0 }
}, { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);
