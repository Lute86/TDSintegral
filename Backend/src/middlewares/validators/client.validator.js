import { ValidatorBase } from "./base.validator.js";

export class ClientValidator extends ValidatorBase {
  static validateCreate(req, res, next) {
    const { nombre, apellido, email } = req.body;

    const missing = this.requireFields(res, ["nombre", "apellido", "email"], req.body);
    if (missing) return; // ya respondió

    if (!this.isEmail(email))
      return res.status(400).json({ msg: "Formato de email inválido" });

    next();
  }

  static validateUpdate(req, res, next) {
    const { email } = req.body;
    if (email && !this.isEmail(email))
      return res.status(400).json({ msg: "Formato de email inválido" });
    next();
  }
}
