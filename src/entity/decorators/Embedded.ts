import type BaseEntityAny from '../Abstract/BaseEntityAny'

export default function Embedded (
  name: string,
  Type: new (...args: any[]) => BaseEntityAny
) {
  return function (target: BaseEntityAny, propertyKey: string | symbol): void {
    function getter (this: BaseEntityAny): BaseEntityAny | undefined {
      name = this.getFieldName(name)
      if (name === '') return
      if (this.body._embedded != null && Object.prototype.hasOwnProperty.call(this.body._embedded, name)) {
        return new Type(this.body._embedded[name])
      }
    }

    // function setter(this: BaseEntityAny, value: BaseEntityAny) {
    //   name = this.getFieldName(name);
    //   if (!name) return
    //   this.body._embedded[name] = value.body;
    // }

    Object.defineProperty(target, propertyKey, {
      get: getter,
      // set: setter,
      enumerable: true,
      configurable: true
    })
  }
}
