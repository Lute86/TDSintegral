import HttpResponse from "../../utils/HttpResponse.utils.js";
import { ValidatorBase } from "./base.validator.js";

export class AuthValidator extends ValidatorBase {
  static validateLogin(req, res, next) {
    const { email, password } = req.body;
    const missing = this.requireFields(res, ["email", "password"], req.body);
    if (missing) return;

    if (!this.isEmail(email))
      return HttpResponse.badRequest(res, { msg: "Formato de email inválido" });

    next();
  }
}
