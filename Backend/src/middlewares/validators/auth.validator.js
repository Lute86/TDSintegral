import HttpResponse from "../../utils/HttpResponse.utils.js";
import { ValidatorBase } from "./base.validator.js";

export class AuthValidator {
  static validateLogin(req, res, next) {
    const { email, password } = req.body;

    const missing = ValidatorBase.requireFields(["email", "password"], req.body);
    if (missing.length > 0)
      return HttpResponse.badRequest(res, { msg: `Faltan campos: ${missing.join(", ")}` });

    if (!ValidatorBase.isEmail(email))
      return HttpResponse.badRequest(res, { msg: "Formato de email inválido" });

    next();
  }
}
