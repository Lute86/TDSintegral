import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  estado: { type: String, default: "pendiente" },
  metricas: {
    horasTotales: Number,
    horasRedes: Number,
    horasMails: Number,
    otras: { type: Map, of: Number }
  },
  pago: {
    monto: Number,
    fecha: Date,
    status: String,
    metodo: String
  }
}, { timestamps: true });

export const Project = mongoose.model("Project", projectSchema);
