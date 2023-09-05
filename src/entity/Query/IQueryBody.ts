import { type IEndpoint } from '../Abstract/IEndpoint'
import type IAbstractBody from '../Abstract/IAbstractBody'
import type IUserBody from '../User/IUserBody'
import type IWorkPackageCollectionBody from '../WP/WorkPackageCollection'

export enum TimelineZoomLevelEnum {
  days = 'days',
  weeks = 'weeks',
  months = 'months',
  quarters = 'quarters',
  years = 'years',
}

export enum HighlightingModeEnum {
  none = 'none',
  inline = 'inline',
  status = 'status',
  priority = 'priority',
  type = 'type',
}

export enum DisplayRepresentationEnum {
  card = 'card',
  list = 'list',
}
export interface QueryFilterInstance {
  _type: `${string}QueryFilter`
  name: string
  values?: string[]
  _links: {
    schema: IEndpoint
    filter: IEndpoint
    operator: IEndpoint
    values: IEndpoint[]
  }
}

export interface QueryColumn extends IAbstractBody<string> {
  _type: 'QueryColumn::Property'
  name: string
}
export interface QuerySortBy extends IAbstractBody<string> {
  _type: 'QuerySortBy'
  name: string
  _links: {
    self: IEndpoint
    column: IEndpoint
    direction: {
      href: 'urn:openproject-org:api:v3:queries:directions:asc' | 'urn:openproject-org:api:v3:queries:directions:desc'
      title: string
    }
  }

}

/** https://www.openproject.org/docs/api/endpoints/queries/ */
export default interface IQueryBody extends IAbstractBody {
  _type?: 'Query'
  name: string
  starred: boolean
  filters: QueryFilterInstance[]
  sums: boolean
  timelineVisible: boolean
  timelineLabels: object
  timelineZoomLevel: TimelineZoomLevelEnum
  highlightingMode: HighlightingModeEnum
  showHierarchies: boolean
  public: boolean
  displayRepresentation: DisplayRepresentationEnum
  _embedded?: {
    user: IUserBody
    sortBy: object[]
    columns: QueryColumn[]
    results: IWorkPackageCollectionBody
  }
  _links: {
    self: IEndpoint
    user: IEndpoint
    project: IEndpoint
    columns: IEndpoint[]
    highlightedAttributes: IEndpoint[]
    sortBy: IEndpoint[]
    groupBy: string
  }
}
