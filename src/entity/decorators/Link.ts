import BaseEntityAny, { LinkEntity } from "../Abstract/BaseEntityAny";
import { NullLink } from "../Abstract/IEndpoint";
import BaseEntity from "../Abstract/BaseEntity";

export default function Link(
  name: string,
  type: new (...args: any[]) => BaseEntityAny
) {
  return function (target: BaseEntityAny, propertyKey: string | symbol): void {
    function getter(
      this: BaseEntityAny
    ): BaseEntityAny | LinkEntity<BaseEntityAny> | undefined | null {
      name = this.getFieldName(name);
      if (!name) return;

      if (this.body._links.hasOwnProperty(name)) {
        const linkSelf = this.body._links[name];
        const cachedLinks = this._links[name];
        if (cachedLinks !== undefined && !Array.isArray(cachedLinks))
          return cachedLinks;

        if (linkSelf.href) {
          return (this._links[name] = new type(linkSelf));
        } else {
          return (this._links[name] = null);
        }
      }
    }

    function setter(this: BaseEntityAny | BaseEntity, value: BaseEntityAny) {
      name = this.getFieldName(name);
      if (!name) return;

      if (
        this.body._links[name]?.href !== value?.self?.href &&
        this instanceof BaseEntity &&
        Array.isArray(this.$dirty)
      )
        this.$dirty.push(`_links.${name}`);

      if (value) {
        this._links[name] = value;
        this.body._links[name] = value.self;
      } else {
        this._links[name] = null;
        this.body._links[name] = new NullLink();
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
