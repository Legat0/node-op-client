import type IAbstractBody from '../Abstract/IAbstractBody'
import type IWPBody from './IWPBody'
import type WP from './WP'
import BaseEntityAny, {
  type EntityCollectionElement
} from '../Abstract/BaseEntityAny'
import Field from '../decorators/Field'
import type WPSchema from './WPSchema'
import type ICollection from '../Schema/ICollection'
import { type EntityFieldSchema } from './WPSchema'
import { type EntityFieldTypes } from '../Schema/IFieldSchema'

export interface IWorkPackageCollectionBody extends IAbstractBody {
  _type: 'WorkPackageCollection'
  total: number
  count: number
  pageSize: number
  offset: number

  _embedded: {
    elements: IWPBody[]
    schemas?: ICollection<WPSchema>
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

  get schemas (): WPSchema[] {
    return this.body._embedded.schemas?._embedded.elements ?? []
  }

  get unionSchema (): WPSchema | null {
    // let unionSchema = {}
    if (this.schemas.length > 0) {
      return this.schemas.reduce((unionSchema, schema) => {
        return { ...unionSchema, ...schema }
      }, this.schemas[0])
    } else {
      return null
    }
  }

  getFieldSchema (fieldId: string): EntityFieldSchema<EntityFieldTypes> | null {
    if (this.unionSchema != null) {
      return this.unionSchema[fieldId]
    } else {
      return null
    }
  }

  body: IWorkPackageCollectionBody

  elements<T extends WP>(
    Type: new (...args: any[]) => T
  ): Array<EntityCollectionElement<T>> {
    return this.body._embedded.elements.map((x) => new Type(x))
  }
}
