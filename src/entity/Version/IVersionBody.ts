import { type IEndpoint } from '../Abstract/IEndpoint'
import type IAbstractBody from '../Abstract/IAbstractBody'
import { type VersionStatusEnum } from './Version'
import type IProjectBody from '../Project/IProjectBody'

export default interface IVersionBody extends IAbstractBody {
  _type?: 'Version'
  /** Название версии/спринта/этапа. Уникальное в рамках проекта */
  name: string
  // description: string
  startDate: string
  endDate: string
  status: VersionStatusEnum

  _embedded?: {
    project?: IProjectBody
  }

  _links: IAbstractBody['_links'] & {
    definingProject?: IEndpoint
  }
}
