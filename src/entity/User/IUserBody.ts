import { type PrincipalTypeEnum } from '../Principal/Principal'
import type IAbstractBody from '../Abstract/IAbstractBody'
import { type WithCustomFields, type WithTimestamps } from '../Abstract/IAbstractBody'

export default interface IUserBody extends IAbstractBody, WithTimestamps {
  _type: PrincipalTypeEnum.User
  name: string
  login: string
  admin: boolean
  firstName: string
  lastName: string
  email: string
  avatar: string
  status: string
  identityUrl: any
  _links: IAbstractBody['_links'] & WithCustomFields
}
