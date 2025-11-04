import { Client } from "../models/Client.model.js";

export class ClientService {
  static async getAll() {
    return await Client.find();
  }

  static async getById(id) {
    const client = await Client.findById(id);
    if (!client) throw new Error("Cliente no encontrado");
    return client;
  }

  static async create(data) {    
    // Validar email único
    const exists = await Client.findOne({ email: data.email });
    if (exists) throw new Error("Email ya existe");
    return await Client.create(data);
  }

  static async updatePut(id, data) {
    const client = await Client.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!client) throw new Error("Cliente no encontrado");
    return client;
  }

  static async update(id, data) {
    const client = await Client.findByIdAndUpdate(id, { $set: data }, {
      new: true,
      runValidators: true,
    });
    if (!client) throw new Error("Cliente no encontrado");
    return client;
  }

  static async deleteById(id) {
    const client = await Client.findByIdAndDelete(id);
    if (!client) throw new Error("Empleado no encontrado");
    return client;
  }

}
