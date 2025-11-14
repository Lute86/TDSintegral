
import { ClientService } from "../services/Client.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";

export class ClientController {
  static async getAll(req, res) {
    try {
      const clients = await ClientService.getAll();
      
      HttpResponse.success(res, clients);
    } catch (error) {
      
      HttpResponse.serverError(res, error.message);
    }
  }

  static async getById(req, res) {
    const id = req.params.id;
    try {      
      const client = await ClientService.getById(id);
      if (!client) return HttpResponse.notFound(res, "Cliente no encontrado");
      HttpResponse.success(res, client);
    } catch (error) {
      if (error.message.includes("userID")) return HttpResponse.badRequest(res, error.message)
      HttpResponse.serverError(res, error.message);
    }
  }

  static async create(req, res) {
    
    try {
      const newClient = await ClientService.create(req.body);
      HttpResponse.created(res, newClient);
    } catch (error) {
      if (error.message.includes("Email")) return HttpResponse.conflict(res, error.message)
      HttpResponse.serverError(res, error.message);
    }
  }

  static async update(req, res) {
    try {
      const updated = await ClientService.update(req.params.id, req.body);
      HttpResponse.success(res, updated);
    } catch (error) {
      if(error.message.includes("Cliente")) return HttpResponse.notFound(res, error.message);
      HttpResponse.serverError(res, error.message);
    }
  }

  static async deleteById(req, res) {
    try {
      const deleted = await ClientService.deleteById(req.params.id);
      if (!deleted) return HttpResponse.badRequest(res, {msg:"Empleado no encontrado"});
      HttpResponse.noContent(res, deleted);
    } catch (error) {
      HttpResponse.serverError(res, error.message);
    }
  }
}
