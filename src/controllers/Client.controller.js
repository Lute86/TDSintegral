
import { ClientService } from "../services/Client.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";

export class ClientController {
  static async getAll(req, res) {
    try {
      const clients = await ClientService.getAll();
      HttpResponse.success(res, clients);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }

}  