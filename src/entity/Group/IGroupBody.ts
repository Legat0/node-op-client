import { type PrincipalTypeEnum } from '../Principal/Principal'
import type IAbstractBody from '../Abstract/IAbstractBody'
import { type WithCustomFields, type WithTimestamps } from '../Abstract/IAbstractBody'

export default interface IGroupBody extends IAbstractBody, WithTimestamps, WithCustomFields {
  _type: PrincipalTypeEnum.Group
  name: string
  _links: IAbstractBody['_links'] & WithTimestamps
}
