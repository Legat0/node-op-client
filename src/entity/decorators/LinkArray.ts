import { type LinkEntity } from '../Abstract/BaseEntityAny'
import type BaseEntityAny from '../Abstract/BaseEntityAny'

export default function LinkArray (
  /** real name or alias */
  name: string,
  Type: new (...args: any[]) => BaseEntityAny
) {
  return function (target: BaseEntityAny, propertyKey: string | symbol): void {
    function getter (this: BaseEntityAny): BaseEntityAny[] | Array<LinkEntity<BaseEntityAny>> | undefined | null {
      name = this.getFieldName(name)
      if (name === '') return

      if (Object.prototype.hasOwnProperty.call(this.body._links, name)) {
        const linkSelf = this.body._links[name]
        const cachedLinks = this._links[name]
        if (cachedLinks !== undefined && Array.isArray(cachedLinks)) return cachedLinks

        if (Array.isArray(linkSelf)) {
          return (this._links[name] = linkSelf.map((x) => new Type(x)))
        } else {
          throw new Error('link value is not array')
        }
      }
    }

    function setter (this: BaseEntityAny, value: BaseEntityAny[]): void {
      name = this.getFieldName(name)
      if (name === '') return

      if (value != null) {
        this._links[name] = value
        this.body._links[name] = value.map((x) => x.self)
      } else {
        this._links[name] = []
        this.body._links[name] = []
      }
    }

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    })
  }
}
