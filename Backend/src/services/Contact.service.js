import { Contact } from "../models/Contact.model.js";
import mongoose from "mongoose";

export class ContactService {
  static async getAll() {
    return await Contact.find().sort({ createdAt: -1 });
  }

  static async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error("ID inválido");

    const contact = await Contact.findById(id);
    if (!contact) throw new Error("Consulta no encontrada");
    return contact;
  }

  static async create(data) {
    return await Contact.create(data);
  }

  static async update(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error("ID inválido");

    const contact = await Contact.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!contact) throw new Error("Consulta no encontrada");
    return contact;
  }

  static async updateEstado(id, estado) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error("ID inválido");

    const contact = await Contact.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    );

    if (!contact) throw new Error("Consulta no encontrada");
    return contact;
  }

  static async deleteById(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error("ID inválido");

    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) throw new Error("Consulta no encontrada");
    return contact;
  }

  static async countByEstado(estado) {
    return await Contact.countDocuments({ estado });
  }
}
