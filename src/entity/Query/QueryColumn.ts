import Field from '../decorators/Field'
import BaseEntityAny from '../Abstract/BaseEntityAny'
import type IAbstractBody from '../Abstract/IAbstractBody'
import { type EntityFieldSchema } from '../WP/WPSchema'
import { type EntityFieldTypes } from '../Schema/IFieldSchema'

export interface QueryColumnBody extends IAbstractBody<string> {
  _type: 'QueryColumn::Property'
  name: string
}

export default class QueryColumn extends BaseEntityAny<string> {
  static url = '/api/v3/queries/columns'

  @Field('name', String)
  public name: string

  body: QueryColumnBody
}

export class QueryColumnWithSchema extends QueryColumn {
  public schema: EntityFieldSchema<EntityFieldTypes> | null = null
}
