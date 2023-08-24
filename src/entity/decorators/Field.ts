import BaseEntityAny from "../Abstract/BaseEntityAny";
import str2date from "../utils/str2date";
import date2str from "../utils/date2str";
import Duration from "../Abstract/Duration";

function castValue(value, type?: any) {
  if (type === Date) {
    return date2str(value);
  } else if (type === Duration) {
    return value ? (value as Duration).toString() : null;
  } else {
    return value;
  }
}

export default function Field(name: string, type?: any) {
  return function (target: BaseEntityAny, propertyKey: string | symbol): void {
    function getter() {      
      name = this.getFieldName(name);
      if (!name) return
      if (this.body.hasOwnProperty(name)) {
        if (type === Date) {
          return str2date(this.body[name]);
        } else if (type === Duration) {
          return this.body[name] ? Duration.parse(this.body[name]) : null;
        } else {
          return this.body[name];
        }
      }
    }

    function setter(value) {
      name = this.getFieldName(name);
      if (!name) return
      const newValue = castValue(value);
      if (this.body[name] !== newValue) this.$dirty.push(name);
      this.body[name] = newValue;
    }

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}
