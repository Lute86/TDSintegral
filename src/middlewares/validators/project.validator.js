import HttpResponse from "../../utils/HttpResponse.utils.js";
import { ValidatorBase } from "./base.validator.js";

export class ProjectValidator extends ValidatorBase {
  static validateCreate(req, res, next) {
    const { nombre, clienteId } = req.body;

    const missing = this.requireFields(res, ["nombre", "clienteId"], req.body);
    if (missing) return HttpResponse.badRequest(res,{ msg: `Faltan campos: ${missing.join(", ")}` });

    next();
  }

  static validateUpdate(req, res, next) {
    const { pago } = req.body;
    if (pago && pago.monto && !this.isNumber(pago.monto))
      return HttpResponse.badRequest(res,{ msg: "Monto de pago inválido" });
    next();
  }
}
