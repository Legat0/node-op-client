import { type IEndpoint } from '../Abstract/IEndpoint'
import { type VersionSharingEnum, type VersionStatusEnum } from './Version'
import type IProjectBody from '../Project/IProjectBody'
import type HtmlFieldValue from '../../contracts/HtmlFieldValue'
import type IAbstractBody from 'entity/Abstract/IAbstractBody'
import { type WithCustomFields, type WithTimestamps } from 'entity/Abstract/IAbstractBody'

export default interface IVersionBody extends IAbstractBody, WithTimestamps, WithCustomFields {
  _type?: 'Version'
  /** Название версии/спринта/этапа. Уникальное в рамках проекта */
  name: string
  description: HtmlFieldValue
  startDate: string
  endDate: string
  status: VersionStatusEnum
  sharing: VersionSharingEnum

  _embedded?: {
    project?: IProjectBody
  }

  _links: IAbstractBody['_links'] & WithCustomFields & {
    definingProject?: IEndpoint
  }
}
