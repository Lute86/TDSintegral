import HttpResponse from "../../utils/HttpResponse.utils.js";
import { ValidatorBase } from "./base.validator.js";

export class TaskValidator {
  static validateCreate(req, res, next) {
    const { project, estado, prioridad } = req.body;

    const missing = ValidatorBase.requireFields(["project"], req.body);
    if (missing.length > 0) return HttpResponse.badRequest(res,{ msg: `Faltan campos: ${missing.join(", ")}` });

    const estados = ["pendiente", "en proceso", "finalizada"];
    const prioridades = ["alta", "media", "baja"];

    if (estado && !ValidatorBase.isEnum(estado, estados))
      return HttpResponse.badRequest(res, { msg: "Estado inválido" });

    if (prioridad && !ValidatorBase.isEnum(prioridad, prioridades))
      return HttpResponse.badRequest(res, { msg: "Prioridad inválida" });

    next();
  }

  static validateUpdate(req, res, next) {
    const { estado, prioridad } = req.body;
    const estados = ["pendiente", "en proceso", "finalizada"];
    const prioridades = ["alta", "media", "baja"];

    if (estado && !ValidatorBase.isEnum(estado, estados))
      return HttpResponse.badRequest(res, { msg: "Estado inválido" });

    if (prioridad && !ValidatorBase.isEnum(prioridad, prioridades))
      return HttpResponse.badRequest(res, { msg: "Prioridad inválida" });

    next();
  }
}
