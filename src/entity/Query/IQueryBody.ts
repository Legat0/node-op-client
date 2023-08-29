import { type IEndpoint } from '../Abstract/IEndpoint'
import type IAbstractBody from '../Abstract/IAbstractBody'

export default interface IQueryBody extends IAbstractBody {
  _type?: 'Query'
  name: string
  _links: {
    self: IEndpoint
  }
}
