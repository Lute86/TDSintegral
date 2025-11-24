import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  empleados: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  estado: { type: String, enum: ["pendiente", "en curso", "finalizado"], default: "pendiente" },
  metricas: {
    horasCotizadas: { type: Number, default: 0 },
    horasTotales: { type: Number, default: 0 },
    horasRedes: { type: Number, default: 0 },
    horasMails: { type: Number, default: 0 },
    otras: { type: Map, of: Number }
  },
  pago: {
    monto: { type: Number },
    fecha: { type: Date },
    status: { type: String, enum: ["pendiente", "pagado", "vencido"], default: "pendiente" },
    metodo: { type: String }
  }
}, { timestamps: true });

export const Project = mongoose.model("Project", projectSchema);

