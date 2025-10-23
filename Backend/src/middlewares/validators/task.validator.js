import HttpResponse from "../../utils/HttpResponse.utils.js";
import { ValidatorBase } from "./base.validator.js";

export class TaskValidator extends ValidatorBase {
  static validateCreate(req, res, next) {
    const { proyecto, estado, prioridad } = req.body;

    const missing = this.requireFields(res, ["proyecto"], req.body);
    if (missing) return HttpResponse.badRequest(res,{ msg: `Faltan campos: ${missing.join(", ")}` });

    const estados = ["pendiente", "en proceso", "finalizada"];
    const prioridades = ["alta", "media", "baja"];

    if (estado && !this.isEnum(estado, estados))
      return HttpResponse.badRequest(res, { msg: "Estado inválido" });

    if (prioridad && !this.isEnum(prioridad, prioridades))
      return HttpResponse.badRequest(res, { msg: "Prioridad inválida" });

    next();
  }

  static validateUpdate(req, res, next) {
    const { estado, prioridad } = req.body;
    const estados = ["pendiente", "en proceso", "finalizada"];
    const prioridades = ["alta", "media", "baja"];

    if (estado && !this.isEnum(estado, estados))
      return HttpResponse.badRequest(res, { msg: "Estado inválido" });

    if (prioridad && !this.isEnum(prioridad, prioridades))
      return HttpResponse.badRequest(res, { msg: "Prioridad inválida" });

    next();
  }
}
