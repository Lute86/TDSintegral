import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Employee } from "../models/Employee.model.js";

export class AuthService {
  constructor(secret) {
    this.secret = secret;
  }

  async login(email, password, rolSeleccionado) {
    const user = await Employee.findOne({ email });
    if (!user) throw new Error("Usuario no encontrado");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Contraseña incorrecta");

    if (user.rol !== rolSeleccionado) {
    throw new Error("El rol seleccionado no coincide con el del usuario");
    } 
    const payload = { id: user._id, rol: user.rol };
    const token = jwt.sign(payload, this.secret, { expiresIn: "8h" });

    return {
      token,
     user: { id: user._id, nombre: user.nombre, rol: user.rol }
    };
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
