import type IAbstractBody from '../Abstract/IAbstractBody'
import BaseEntity from '../Abstract/BaseEntity'
import Field from '../decorators/Field'
import { type PrincipalTypeEnum } from '../Principal/Principal'

export interface IPlaceholderUserBody extends IAbstractBody {
  _type: PrincipalTypeEnum.PlaceholderUser
  name: string
  createdAt: string
  updatedAt: string
}

export default class PlaceholderUser extends BaseEntity {
  static url = '/api/v3/placeholder_users'

  body: IPlaceholderUserBody

  @Field('name', String)
    name: string
}
