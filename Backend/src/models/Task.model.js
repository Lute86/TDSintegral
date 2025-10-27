import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  estado: { type: String, enum: ["pendiente", "en proceso", "finalizada"], default: "pendiente" },
  fechaInicio: { type: Date },
  fechaFin: { type: Date },
  prioridad: { type: String, enum: ["alta", "media", "baja"], default: "media" },
  empleados: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  proyect: { type: mongoose.Schema.Types.ObjectId, ref: "Proyect", required: true },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  horasEstimadas: { type: Number, default: 0 },
  horas: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
