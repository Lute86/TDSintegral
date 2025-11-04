import HttpResponse from "../../utils/HttpResponse.utils.js";
import { ValidatorBase } from "./base.validator.js";

export class EmployeeValidator {
  static validateCreate(req, res, next) {
    const { nombre, apellido, email, rol, area, password } = req.body;

    const missing = ValidatorBase.requireFields(["nombre", "apellido", "email", "rol", "area", "password"], req.body);
    if (missing.length > 0) return HttpResponse.badRequest(res,{ msg: `Faltan campos: ${missing.join(", ")}` });
    if (!ValidatorBase.minLen(password)) return HttpResponse.badRequest(res,{ msg: "Contrasena de al menos 8 caracteres"});
    const roles = ["administrador", "consultor", "supervisor"];
    const areas = ["SEO/SEM", "Social Media", "Contenidos", "Administración"];

    if (!ValidatorBase.isEnum(rol, roles))
      return HttpResponse.badRequest(res, { msg: "Rol inválido" });

    if (!ValidatorBase.isEnum(area, areas))
      return HttpResponse.badRequest(res, { msg: "Área inválida" });

    next();
  }

  static validateUpdate(req, res, next) {
    const { rol, area } = req.body;
    const roles = ["administrador", "consultor", "supervisor"];
    const areas = ["SEO/SEM", "Social Media", "Contenidos", "Administración"];
    
    //TODO validar inputs no nulos, contrasena si se quiere modificar

    if (rol && !ValidatorBase.isEnum(rol, roles))
      return HttpResponse.badRequest(res, { msg: "Rol inválido" });

    if (area && !ValidatorBase.isEnum(area, areas))
      return HttpResponse.badRequest(res, { msg: "Área inválida" });

    next();
  }
}
