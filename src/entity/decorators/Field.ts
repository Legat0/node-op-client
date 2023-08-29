import BaseEntity from '../Abstract/BaseEntity'
import type BaseEntityAny from '../Abstract/BaseEntityAny'
import Duration from '../Abstract/Duration'
import date2str from '../utils/date2str'
import str2date from '../utils/str2date'

function castValue (value: any, type?: any): any {
  if (type === Date) {
    return date2str(value)
  } else if (type === Duration) {
    return value != null ? (value as Duration).toString() : null
  } else {
    return value
  }
}

export default function Field (name: string, type?: any) {
  return function (target: BaseEntityAny, propertyKey: string | symbol): void {
    function getter (this: BaseEntityAny): any {
      name = this.getFieldName(name)
      if (name === '') return
      if (Object.prototype.hasOwnProperty.call(this.body, name)) {
        if (type === Date) {
          return str2date(this.body[name])
        } else if (type === Duration) {
          return this.body[name] != null ? Duration.parse(this.body[name]) : null
        } else {
          return this.body[name]
        }
      }
    }

    function setter (this: BaseEntityAny | BaseEntity, value: any): void {
      name = this.getFieldName(name)
      if (name === '') return
      const newValue = castValue(value)
      if (
        this.body[name] !== newValue &&
        this instanceof BaseEntity &&
        Array.isArray(this.$dirty)
      ) {
        this.$dirty.push(name)
      }

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
