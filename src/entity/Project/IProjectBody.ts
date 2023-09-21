import { type IEndpoint } from '../Abstract/IEndpoint'
import type IAbstractBody from '../Abstract/IAbstractBody'
import { type WithCustomFields, type WithTimestamps } from '../Abstract/IAbstractBody'

export default interface IProjectBody extends IAbstractBody, WithTimestamps, WithCustomFields {
  _type: 'Project'
  identifier: string
  name?: string
  active?: boolean
  public?: boolean
  description?: {
    format: 'markdown'
    raw: string
    html: string
  }
  status: string
  _links: IAbstractBody['_links'] & WithCustomFields & {
    // "categories": {
    //   "href": "/api/v3/projects/2/categories"
    // },
    // "delete": {
    //   "href": "/api/v3/projects/2",
    //   "method": "delete"
    // },
    // "schema": {
    //   "href": "/api/v3/projects/schema"
    // },
    parent: IEndpoint
  }
  position?: number
  isDefault?: boolean
  isMilestone?: boolean
}
