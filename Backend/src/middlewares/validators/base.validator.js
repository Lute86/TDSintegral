export class ValidatorBase {
  static isEmpty(value) {
    return value === undefined || value === null || value === "";
  }

  static isEmail(value) {
    //TODO email gomarketing.com
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }

  static isEnum(value, allowed) {
    return allowed.includes(value);
  }

  static isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  static requireFields(fields, data) {
    return fields.filter(f => this.isEmpty(data[f]));
  }

  static minLen(value){
    return value.length > 7;
  }
}
