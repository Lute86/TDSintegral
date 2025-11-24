
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
    try {
      const client = await ClientService.getById(req.params.id);
      HttpResponse.success(res, client);
    } catch (error) {
      HttpResponse.serverError(res, error.message);
    }
  }

  static async create(req, res) {
    
    try {
      const newClient = await ClientService.create(req.body);
      HttpResponse.created(res, newClient);
    } catch (error) {
      HttpResponse.serverError(res, error.message);
    }
  }

  static async update(req, res) {
    try {
      const updated = await ClientService.update(req.params.id, req.body);
      HttpResponse.success(res, updated);
    } catch (error) {
      HttpResponse.serverError(res, error.message);
    }
  }

  static async deleteById(req, res) {
    try {
      const deleted = await ClientService.deleteById(req.params.id);
      HttpResponse.noContent(res, deleted);
    } catch (error) {
      HttpResponse.serverError(res, error.message);
    }
  }
}
