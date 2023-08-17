import BaseEntity from "../Abstract/BaseEntity";
import Field from "../decorators/Field";
import IUserBody from "./IUserBody";

export enum UserStatusEnum {
  active = 'active',
  registered = 'registered',
  locked = 'locked',
  invited = 'invited',
}
export default class User extends BaseEntity {
  ['constructor']: typeof User

  static url = '/api/v3/users'

  body: IUserBody

  @Field('name', String)
  name: string

  @Field('login', String)
  login: string

  @Field('firstName', String)
  firstName: string

  @Field('lastName', String)
  lastName: string

  @Field('email', String)
  email: string

  @Field('status', UserStatusEnum)
  status: UserStatusEnum
}
