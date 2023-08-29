import type IAbstractBody from '../Abstract/IAbstractBody'

export default interface IRoleBody extends IAbstractBody {
  _type?: 'Role'
  name: string
  _links: IAbstractBody['_links']
}
