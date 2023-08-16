import BaseEntity from "../Abstract/BaseEntity";
import str2date from "../utils/str2date";
import date2str from "../utils/date2str";

export default function Embedded(name: string, type: new (...args: any[]) => BaseEntity) {
  return function (target: BaseEntity, propertyKey: string | symbol): void {
    function getter():BaseEntity {
      if (this.body._embedded.hasOwnProperty(name)) {
        return new type(this.body._embedded[name])
      }
    }

    function setter(value:BaseEntity) {
        this.body._embedded[name] = value.body
    }

    Object.defineProperty(target, propertyKey, {
      get: getter,
      // set: setter,
      enumerable: true,
      configurable: true,
    })
  }
}
