import HttpResponse from "../../utils/HttpResponse.utils.js";
import { ValidatorBase } from "./base.validator.js";

export class ContactValidator {
  static validateCreate(req, res, next) {
    const { nombre, apellido, email, proyecto } = req.body;

    const missing = ValidatorBase.requireFields(["nombre", "apellido", "email", "proyecto"], req.body);
    if (missing.length > 0) {
      // Si viene de formulario HTML, redirigir
      if (req.headers.accept && req.headers.accept.includes("text/html")) {
        return res.redirect('/?error=campos_incompletos');
      }
      return HttpResponse.badRequest(res, { msg: `Faltan campos: ${missing.join(", ")}` });
    }

    if (!ValidatorBase.isEmail(email)) {
      if (req.headers.accept && req.headers.accept.includes("text/html")) {
        return res.redirect('/?error=email_invalido');
      }
      return HttpResponse.badRequest(res, { msg: "Formato de email inválido" });
    }

    next();
  }

  static validateUpdateEstado(req, res, next) {
    const { estado } = req.body;
    const estadosValidos = ['nuevo', 'contactado', 'cerrado'];

    if (!estado || !ValidatorBase.isEnum(estado, estadosValidos)) {
      return HttpResponse.badRequest(res, { msg: "Estado inválido" });
    }

    next();
  }
}