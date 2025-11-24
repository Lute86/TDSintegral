import { ContactService } from "../services/Contact.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";

export class ContactController {
  
  // API
  static async getAll(req, res) {
    try {
      const contacts = await ContactService.getAll();
      HttpResponse.success(res, contacts);
    } catch (error) {
      HttpResponse.serverError(res, error.message);
    }
  }

  static async deleteById(req, res) {
    try {
      await ContactService.deleteById(req.params.id);
      HttpResponse.success(res, { message: 'Consulta eliminada correctamente' });
    } catch (error) {
      if (error.message === "Consulta no encontrada") {
        return HttpResponse.notFound(res, error.message);
      }
      HttpResponse.serverError(res, error.message);
    }
  }

  static async getById(req, res) {
    try {
      const contact = await ContactService.getById(req.params.id);
      HttpResponse.success(res, contact);
    } catch (error) {
      if (error.message === "Consulta no encontrada") {
        return HttpResponse.notFound(res, error.message);
      }
      HttpResponse.serverError(res, error.message);
    }
  }

  // Dashboard
  static async updateEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      await ContactService.updateEstado(id, estado);
      res.redirect('/dashboard');
    } catch (error) {
      res.status(500).render("error", {
        message: `Error al actualizar el registro ${error.message}`
      });
    }
  }

  static async create(req, res) {
    try {
      const { nombre, apellido, email, proyecto, consulta } = req.body;

      await ContactService.create({
        nombre,
        apellido,
        email,
        servicio: proyecto,
        consulta,
        estado: 'nuevo'
      });

      res.redirect('/?success=true');
    } catch (error) {
      res.redirect('/?error=true');
    }
  }
  
}