import HttpResponse from "../../utils/HttpResponse.utils.js";
import { ValidatorBase } from "./base.validator.js";

export class EmployeeValidator extends ValidatorBase {
  static validateCreate(req, res, next) {
    const { nombre, apellido, email, rol, area, password } = req.body;

    const missing = this.requireFields(res, ["nombre", "apellido", "email", "rol", "area", "password"], req.body);
    if (missing) return HttpResponse.badRequest(res,{ msg: `Faltan campos: ${missing.join(", ")}` });

    const roles = ["administrador", "consultor", "supervisor"];
    const areas = ["SEO/SEM", "Social Media", "Contenidos", "Administración"];

    if (!this.isEnum(rol, roles))
      return HttpResponse.badRequest(res, { msg: "Rol inválido" });

    if (!this.isEnum(area, areas))
      return HttpResponse.badRequest(res, { msg: "Área inválida" });

    next();
  }

  static validateUpdate(req, res, next) {
    const { rol, area } = req.body;
    const roles = ["administrador", "consultor", "supervisor"];
    const areas = ["SEO/SEM", "Social Media", "Contenidos", "Administración"];

    if (rol && !this.isEnum(rol, roles))
      return HttpResponse.badRequest(res, { msg: "Rol inválido" });

    if (area && !this.isEnum(area, areas))
      return HttpResponse.badRequest(res, { msg: "Área inválida" });

    next();
  }
}
