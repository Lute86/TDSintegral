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

    if (email && !ValidatorBase.isEmail(email))
       return HttpResponse.badRequest(res, { msg: "Email inválido" });

    if (!ValidatorBase.isEnum(rol, roles))
      return HttpResponse.badRequest(res, { msg: "Rol inválido" });

    if (!ValidatorBase.isEnum(area, areas))
      return HttpResponse.badRequest(res, { msg: "Área inválida" });

    next();
  }

  static validateUpdate(req, res, next) {
    const { password, nombre, apellido, telefono, email, rol, area } = req.body;
    const roles = ["administrador", "consultor", "supervisor"];
    const areas = ["SEO/SEM", "Social Media", "Contenidos", "Administración"];

    if (!nombre && !apellido && !telefono && !email && !rol && !area && !password) return HttpResponse.badRequest(res, { msg: "Nada para modificar" });

    if (password && typeof(password) === 'number') return HttpResponse.badRequest(res, {msg : "Password debe ser un string"})
    if (telefono && !ValidatorBase.isPhone(telefono)) return HttpResponse.badRequest(res, { msg: "Formato de teléfono inválido." });

    //TODO validar contrasena si se quiere modificar
    if (email && !ValidatorBase.isEmail(email))
       return HttpResponse.badRequest(res, { msg: "Email inválido" });

    if (rol && !ValidatorBase.isEnum(rol, roles))
      return HttpResponse.badRequest(res, { msg: "Rol inválido" });

    if (area && !ValidatorBase.isEnum(area, areas))
      return HttpResponse.badRequest(res, { msg: "Área inválida" });

    next();
  }
}
