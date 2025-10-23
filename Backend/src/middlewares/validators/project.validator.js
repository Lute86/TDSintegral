import { ValidatorBase } from "./base.validator.js";

export class ProjectValidator extends ValidatorBase {
  static validateCreate(req, res, next) {
    const { nombre, clienteId } = req.body;

    const missing = this.requireFields(res, ["nombre", "clienteId"], req.body);
    if (missing) return;

    next();
  }

  static validateUpdate(req, res, next) {
    const { pago } = req.body;
    if (pago && pago.monto && !this.isNumber(pago.monto))
      return res.status(400).json({ msg: "Monto de pago inválido" });
    next();
  }
}
