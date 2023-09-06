import BaseEntity from '../Abstract/BaseEntity'
import Field from '../decorators/Field'
import type IUserBody from 'entity/User/IUserBody'
import type IGroupBody from '../Group/IGroupBody'
import { type IPlaceholderUserBody } from '../User/PlaceholderUser'

export enum PrincipalTypeEnum {
  User = 'User',
  Group = 'Group',
  PlaceholderUser = 'PlaceholderUser',
}

export default class Principal extends BaseEntity {
  // ["constructor"]: typeof User;

  static url = '/api/v3/principals'

  body: IUserBody | IGroupBody | IPlaceholderUserBody

  @Field('name', String)
    name: string

  get type (): PrincipalTypeEnum {
    return this.body._type
  }
}
