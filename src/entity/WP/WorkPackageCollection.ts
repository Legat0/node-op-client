import type IAbstractBody from '../Abstract/IAbstractBody'
import type IWPBody from './IWPBody'
import type WP from './WP'
import BaseEntityAny, { type EntityCollectionElement } from '../Abstract/BaseEntityAny'
import Field from '../decorators/Field'

export interface IWorkPackageCollectionBody extends IAbstractBody {
  _type: 'WorkPackageCollection'
  total: number
  count: number
  pageSize: number
  offset: number
  _embedded: {
    elements: IWPBody[]
  }
}

export default class WorkPackageCollection extends BaseEntityAny {
  @Field()
    total: number

  @Field()
    count: number

  @Field()
    pageSize: number

  @Field()
    offset: number

  body: IWorkPackageCollectionBody

  elements<T extends WP> (Type: new (...args: any[]) => T): Array<EntityCollectionElement<T>> {
    return this.body._embedded.elements.map(x => new Type(x))
  }
}
