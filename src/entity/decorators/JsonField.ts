import BaseEntity from "../Abstract/BaseEntity";

export default function JsonField(name: string, type?: any) {
  return function (target: BaseEntity, propertyKey: string | symbol): void {
    function getter() {
      name = this.getFieldName(name);
      if (!name) return

      if (this.body.hasOwnProperty(name)) {
        const value = this.body[name] ? JSON.parse(this.body[name]) : null;
        if (type !== undefined) {
          if (Array.isArray(value)) {
            return value.map((x) => new type(x));
          } else {
            return new type(value);
          }
        } else {
          return value;
        }
      }
    }

    function setter(value) {
      name = this.getFieldName(name);
      if (!name) return

      const newValue = JSON.stringify(value);
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
