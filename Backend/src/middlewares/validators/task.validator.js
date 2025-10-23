import { ValidatorBase } from "./base.validator.js";

export class TaskValidator extends ValidatorBase {
  static validateCreate(req, res, next) {
    const { proyecto, estado, prioridad } = req.body;

    const missing = this.requireFields(res, ["proyecto"], req.body);
    if (missing) return;

    const estados = ["pendiente", "en proceso", "finalizada"];
    const prioridades = ["alta", "media", "baja"];

    if (estado && !this.isEnum(estado, estados))
      return res.status(400).json({ msg: "Estado inválido" });

    if (prioridad && !this.isEnum(prioridad, prioridades))
      return res.status(400).json({ msg: "Prioridad inválida" });

    next();
  }

  static validateUpdate(req, res, next) {
    const { estado, prioridad } = req.body;
    const estados = ["pendiente", "en proceso", "finalizada"];
    const prioridades = ["alta", "media", "baja"];

    if (estado && !this.isEnum(estado, estados))
      return res.status(400).json({ msg: "Estado inválido" });

    if (prioridad && !this.isEnum(prioridad, prioridades))
      return res.status(400).json({ msg: "Prioridad inválida" });

    next();
  }
}
