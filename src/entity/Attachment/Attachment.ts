import type HtmlFieldValue from '../../contracts/HtmlFieldValue'
import Field from '../../entity/decorators/Field'
import Link from '../../entity/decorators/Link'
import User from '../../entity/User/User'
import BaseEntity from '../Abstract/BaseEntity'
import type IAttachmentBody from './IAttachmentBody'

export class Attachment extends BaseEntity {
  public static url = '/api/v3/attachments'

  public body: IAttachmentBody

  @Field('fileName', String)
  public fileName: string

  @Field('fileSize', Number)
  public fileSize: number

  @Field('description', Object)
  public comment: HtmlFieldValue | string

  @Field('createdAt', Date)
  public createdAt: Date

  @Link('author', User)
  public author: User
}
