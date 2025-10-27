import HttpResponse from "../../utils/HttpResponse.utils.js";
import { ValidatorBase } from "./base.validator.js";

export class ClientValidator extends ValidatorBase {
  static validateCreate(req, res, next) {
    const { nombre, apellido, email } = req.body;

    const missing = this.requireFields(res, ["nombre", "apellido", "email"], req.body);
    if (missing) return HttpResponse.badRequest(res,{ msg: `Faltan campos: ${missing.join(", ")}` });

    if (!this.isEmail(email))
      return HttpResponse.badRequest(res,{ msg: "Formato de email inválido" });

    next();
  }

  static validateUpdate(req, res, next) {
    const { email } = req.body;
    if (email && !this.isEmail(email))
      return HttpResponse.badRequest(res,{ msg: "Formato de email inválido" });
    next();
  }
}
