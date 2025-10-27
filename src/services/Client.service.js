import { Client } from "../models/Client.model.js";

export class ClientService {
  static async getAll() {
    return await Client.find();
  }

  static async create(data) {
    return await Client.create(data);
  }
}
