import { Contact } from "../models/Contact.model.js";

export class ContactController {
  static async create(req, res) {
    try {
      const { nombre, apellido, email, proyecto, consulta } = req.body;
      
      const newContact = new Contact({
        nombre,
        apellido,
        email,
        servicio: proyecto,
        consulta,
        estado: 'nuevo'
      });
      
      await newContact.save();
      console.log('✅ Consulta guardada:', newContact);
      
      // Redirigir a landing con mensaje de éxito
      res.redirect('/?success=true');
    } catch (error) {
      console.error('❌ Error al guardar consulta:', error);
      res.redirect('/?error=true');
    }
  }

  static async getAll(req, res) {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      
      await Contact.findByIdAndUpdate(id, { estado });
      console.log(`✅ Estado actualizado: ${estado}`);
      res.redirect('/dashboard');
    } catch (error) {
      console.error('❌ Error al actualizar estado:', error);
      res.status(500).send('Error al actualizar estado');
    }
  }

  static async deleteById(req, res) {
    try {
      const { id } = req.params;
      await Contact.findByIdAndDelete(id);
      console.log('✅ Consulta eliminada');
      res.json({ message: 'Consulta eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}