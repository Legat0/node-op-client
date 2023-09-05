import type BaseEntityAny from '../Abstract/BaseEntityAny'

export default function EmbeddedArray (
  name: string,
  ItemType: new (...args: any[]) => BaseEntityAny
) {
  return function (target: BaseEntityAny, propertyKey: string | symbol): void {
    function getter (this: BaseEntityAny): BaseEntityAny[] | undefined {
      name = this.getFieldName(name)
      if (name === '') return
      if (this.body._embedded != null && Object.prototype.hasOwnProperty.call(this.body._embedded, name)) {
        if (Array.isArray(this.body._embedded[name])) {
          return this.body._embedded[name].map((x: any) => new ItemType(x))
        } else {
          throw new Error(`_embedded[${name}] is not array`)
        }
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
