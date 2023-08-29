import type HtmlFieldValue from '../../contracts/HtmlFieldValue'
import type IAbstractBody from '../Abstract/IAbstractBody'

export default interface IAttachmentBody extends IAbstractBody {
  _type?: 'Attachment'

  fileName: string
  fileSize: number
  createdAt: string
  contentType: string
  description: HtmlFieldValue | string

  _links: IAbstractBody['_links']
}
