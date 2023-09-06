import { type PrincipalTypeEnum } from '../Principal/Principal'
import type IAbstractBody from '../Abstract/IAbstractBody'

export default interface IGroupBody extends IAbstractBody {
  _type: PrincipalTypeEnum.Group
  name: string
  createdAt: string
  updatedAt: string

}
