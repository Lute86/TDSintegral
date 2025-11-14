import HttpResponse from "../../utils/HttpResponse.utils.js";
import { ValidatorBase } from "./base.validator.js";

export class ClientValidator {
  static validateCreate(req, res, next) {
    const { nombre, apellido, email, consulta } = req.body;
    
    const missing = ValidatorBase.requireFields(["nombre", "apellido", "email", "consulta"], req.body);
    if (missing.length > 0) return HttpResponse.badRequest(res,{ msg: `Faltan campos: ${missing.join(", ")}` });

    if (!ValidatorBase.isEmail(email))
      return HttpResponse.badRequest(res,{ msg: "Formato de email inválido" });

    next();
  }

  static validateUpdate(req, res, next) {
    const { nombre, apellido, email, consulta, telefono } = req.body;

    const hasData = nombre || apellido || email || consulta || telefono;
    if (!hasData) return HttpResponse.badRequest(res, { msg: "No hay datos para modificar." });

    if (email && !ValidatorBase.isEmail(email)) return HttpResponse.badRequest(res, { msg: "Formato de email inválido." });

    if (telefono && !ValidatorBase.isPhone(telefono)) return HttpResponse.badRequest(res, { msg: "Formato de teléfono inválido." });
    
    next();
  }

  static validateIdType(req, res, next){
    const id = req.params.id;
    if  (!ValidatorBase.isUUID(id) && !ValidatorBase.isMongoId(id)) return HttpResponse.badRequest(res, {msg: "Id invalido"});

    next();
  }
}
