import BaseEntity from "../Abstract/BaseEntity";
import str2date from "../utils/str2date";
import date2str from "../utils/date2str";
import { NullLink } from "../Abstract/IEndpoint";

export default function Link(name: string, type: new (...args: any[]) => BaseEntity) {
  return function (target: BaseEntity, propertyKey: string | symbol): void {
    function getter(): BaseEntity {
      if (this.body._links.hasOwnProperty(name)) {
        const linkSelf = this.body._links[name]
        if (linkSelf.href) {
          return this._links[name] === undefined ? (this._links[name] = new type(linkSelf)) : this._links[name]
        } else {
          return (this._links[name]=null)
        }
      }
    }

    function setter(value: BaseEntity) {
      if (this.body._links[name]?.href !== value?.self?.href) this.$dirty.push(`_links.${name}`)

      if (value) {
        this._links[name] = value
        this.body._links[name] = value.self
      } else {
        this._links[name] = null
        this.body._links[name] = new NullLink()
      }
    }
    

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    })
  }
}
