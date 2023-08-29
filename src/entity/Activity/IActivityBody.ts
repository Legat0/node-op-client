import type HtmlFieldValue from '../../contracts/HtmlFieldValue'
import type IAbstractBody from '../Abstract/IAbstractBody'

export default interface IActivityBody extends IAbstractBody {
  _type?: 'Activity'
  createdAt: string
  updatedAt: string
  comment: HtmlFieldValue | string
  version: number
  _links: IAbstractBody['_links']
}
