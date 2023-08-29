import type IAbstractBody from '../Abstract/IAbstractBody'

export default interface IStatusBody extends IAbstractBody {
  _type: 'Status'
  name: string
  position: number
  isDefault: boolean
  isClosed: boolean
  isReadonly: boolean
  color: string
  defaultDoneRatio: number
}
