import type IAbstractBody from '../Abstract/IAbstractBody'

export default interface IPriorityBody extends IAbstractBody {
  _type?: 'Priority'
  name: string
  _links: IAbstractBody['_links']
}
