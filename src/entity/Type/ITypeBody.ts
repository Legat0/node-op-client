import type IAbstractBody from '../Abstract/IAbstractBody'
import { type WithTimestamps } from '../Abstract/IAbstractBody'

export default interface ITypeBody extends IAbstractBody, WithTimestamps {
  _type: 'Type'
  name: string
  color: string | null
  position: number
  isDefault: boolean
  isMilestone: boolean
}
