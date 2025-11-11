import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String },
  consulta: { type: String }
}, { timestamps: true });

export const Client = mongoose.model("Client", clientSchema);

