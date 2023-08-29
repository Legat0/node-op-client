import type BaseEntityAny from '../Abstract/BaseEntityAny'
import BaseEntity from '../Abstract/BaseEntity'

export default function JsonField (name: string, Type?: any) {
  return function (target: BaseEntity, propertyKey: string | symbol): void {
    function getter (this: BaseEntityAny | BaseEntity): any {
      name = target.getFieldName(name)
      if (name === '') return

      if (Object.prototype.hasOwnProperty.call(this.body, name)) {
        const value = this.body[name] != null ? JSON.parse(this.body[name]) : null
        if (Type !== undefined) {
          if (Array.isArray(value)) {
            return value.map((x) => new Type(x))
          } else {
            return new Type(value)
          }
        } else {
          return value
        }
      }
    }

    function setter (this: BaseEntityAny | BaseEntity, value: any): void {
      name = target.getFieldName(name)
      if (name === '') return

      const newValue = JSON.stringify(value)
      if (this.body[name] !== newValue && this instanceof BaseEntity &&
        Array.isArray(this.$dirty)) this.$dirty.push(name)
      this.body[name] = newValue
    }

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    })
  }
}
