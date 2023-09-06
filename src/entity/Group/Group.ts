import Field from '../decorators/Field'
import BaseEntity from '../Abstract/BaseEntity'
import type IGroupBody from './IGroupBody'

export default class Group extends BaseEntity {
  // ["constructor"]: typeof User;

  static url = '/api/v3/groups'

  body: IGroupBody

  @Field('name', String)
    name: string
}
