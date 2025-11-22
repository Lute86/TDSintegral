import { ContactService } from "../services/Contact.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";

export class ContactController {
  // Crear consulta desde landing page
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

      console.log('✅ Consulta guardada correctamente');
      res.redirect('/?success=true');
    } catch (error) {
      console.error('❌ Error al guardar consulta:', error.message);
      res.redirect('/?error=true');
    }
  }

  // API: Obtener todas las consultas
  static async getAll(req, res) {
    try {
      const contacts = await ContactService.getAll();
      HttpResponse.success(res, contacts);
    } catch (error) {
      HttpResponse.serverError(res, error.message);
    }
  }

  // API: Obtener consulta por ID
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

  // Dashboard: Actualizar estado de consulta
  static async updateEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      await ContactService.updateEstado(id, estado);
      console.log(`✅ Estado actualizado: ${estado}`);
      res.redirect('/dashboard');
    } catch (error) {
      console.error('❌ Error al actualizar estado:', error.message);
      res.status(500).send('Error al actualizar estado');
    }
  }

  // API: Eliminar consulta
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
}