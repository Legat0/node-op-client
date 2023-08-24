import BaseEntityAny from "../Abstract/BaseEntityAny";

export default function LinkArray(
  /** real name or alias */
  name: string,
  type: new (...args: any[]) => BaseEntityAny
) {
  return function (target: BaseEntityAny, propertyKey: string | symbol): void {
    function getter(): BaseEntityAny[] | undefined | null {
      name = this.getFieldName(name);
      if (!name) return

      if (this.body._links.hasOwnProperty(name)) {
        const linkSelf = this.body._links[name];
        if (this._links[name] !== undefined) return this._links[name];

        if (Array.isArray(linkSelf)) {
          return (this._links[name] = linkSelf.map((x) => new type(x)));
        } else {
          throw new Error("link value is not array");
        }
      }
    }

    function setter(value: BaseEntityAny[]) {
      name = this.getFieldName(name);
      if (!name) return

      if (value) {
        this._links[name] = value;
        this.body._links[name] = value.map((x) => x.self);
      } else {
        this._links[name] = [];
        this.body._links[name] = [];
      }
    }

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}
