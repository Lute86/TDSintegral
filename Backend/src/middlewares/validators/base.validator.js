export class ValidatorBase {
  static isEmpty(value) {
    return value === undefined || value === null || value === "";
  }

  static isEmail(value) {
    if (!value) return false;
    //TODO email gomarketing.com
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }

  static isEnum(value, allowed) {
    if (!value || !allowed) return false;
    return allowed.includes(value);
  }

  static isNumber(value) {
    if (!value) return false;
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  static requireFields(fields, data) {
    if (!fields || !data) return null;
    return fields.filter(f => this.isEmpty(data[f]));
  }

  static minLen(value){
    if (!value) return false;
    return value.length > 7;
  }

  static isUUID(value){
    if (!value) return false;
    const uuidRegex = new RegExp(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    return uuidRegex.test(value.toLowerCase());
  }

  static isMongoId(value){
    if (!value) return false;
    const mongoIdRegex = new RegExp(/^[0-9a-fA-F]{24}$/);
    return mongoIdRegex.test(value.toLowerCase());
  }

  static isPhone(value) {
    if (typeof value !== 'string') return false;

    const phoneRegex = /^\+?[\s\d()-]{7,20}$/;

    return phoneRegex.test(value);
  }
}
