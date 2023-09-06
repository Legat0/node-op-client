import type HtmlFieldValue from '../../contracts/HtmlFieldValue'
import type IAbstractBody from '../Abstract/IAbstractBody'
import { type WithTimestamps } from '../Abstract/IAbstractBody'

export default interface IActivityBody extends IAbstractBody, WithTimestamps {
  _type?: 'Activity'

  comment: HtmlFieldValue | string
  version: number
  _links: IAbstractBody['_links']
}
