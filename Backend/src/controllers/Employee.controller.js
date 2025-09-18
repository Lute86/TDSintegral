/*
import { ClientService } from "../services/Client.service.js";
import HttpResponse from "../utils/httpResponse.utils.js";

export class ClientController {
  static async getAll(req, res) {
    try {
      const clients = await ClientService.getAll();
      HttpResponse.success(res, clients);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }

  static async create(req, res) {
    try {
      const client = await ClientService.create(req.body);
      HttpResponse.created(res, client);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }
}
 */


import { EmployeeService } from "../services/Employee.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";

export class EmployeeController {
  static async getAll(req, res) {
    try {
      const employees = await EmployeeService.getAll();
      HttpResponse.success(res, employees);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }

  static async create(req, res) {
    try {
      const employee = await EmployeeService.create(req.body);
      HttpResponse.created(res, employee);
    } catch (err) {
      HttpResponse.serverError(res, err.message);
    }
  }
}