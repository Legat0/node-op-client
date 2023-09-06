import Field from '../decorators/Field'
import BaseEntity from '../Abstract/BaseEntity'
import type IRoleBody from './IRoleBody'

export default class Role extends BaseEntity {
  public static url = '/api/v3/roles'

  @Field()
  public name: string

  public body: IRoleBody
}
