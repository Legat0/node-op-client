import type IAbstractBody from '../Abstract/IAbstractBody'

export default interface IPriorityBody extends IAbstractBody {
  _type?: 'Priority'
  name: string
  /** Sort index of the priority */
  position: number
  /** example: #000000 */
  color: string
  isDefault: boolean
  isActive: boolean

  _links: IAbstractBody['_links']
}
