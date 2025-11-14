import { ValidatorBase } from "../middlewares/validators/base.validator.js";
import { Client } from "../models/Client.model.js";

export class ClientService {
  static async getAll() {
    return await Client.find();
    
  }

  static async getById(id) {
      if (!ValidatorBase.isMongoId(id)) throw new Error("Error en el tipo de userID");
      const client = await Client.findById(id);
      return client;
  }

  static async create(data) {    
      const exists = await Client.findOne({ email: data.email });
      if (exists) throw new Error("Email existente");
      
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
      return client;
  }

}
