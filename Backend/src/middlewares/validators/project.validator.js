import HttpResponse from "../../utils/HttpResponse.utils.js";
import { ValidatorBase } from "./base.validator.js";

export class ProjectValidator {
  static validateCreate(req, res, next) {
    const { nombre, clienteId } = req.body;

    const missing = ValidatorBase.requireFields(["nombre", "clienteId"], req.body);
    if (missing.length > 0) return HttpResponse.badRequest(res,{ msg: `Faltan campos: ${missing.join(", ")}` });

    next();
  }

  static validateUpdate(req, res, next) {
    const { pago } = req.body;
    if (pago && pago.monto && !ValidatorBase.isNumber(pago.monto))
      return HttpResponse.badRequest(res,{ msg: "Monto de pago inválido" });
    next();
  }
}
