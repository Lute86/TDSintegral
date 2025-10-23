export class ValidatorBase {
  static isEmpty(value) {
    return value === undefined || value === null || value === "";
  }

  static isEmail(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }

  static isEnum(value, allowed) {
    return allowed.includes(value);
  }

  static isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  static requireFields(res, fields, data) {
    const missing = fields.filter(f => this.isEmpty(data[f]));
    if (missing.length)
      return res.status(400).json({ msg: `Faltan campos: ${missing.join(", ")}` });
    return null;
  }
}
