import type IStatusBody from './IStatusBody'
import BaseEntity from '../Abstract/BaseEntity'
import Field from '../decorators/Field'

export default class Status extends BaseEntity {
  // ['constructor']: typeof Status

  static url = '/api/v3/statuses'

  @Field('name', String)
    name: string | null

  @Field('externalId', String)
    externalId: string // XXX ref to meteor-1c

  @Field('isClosed', Boolean)
    isClosed: boolean

  body: IStatusBody
}
