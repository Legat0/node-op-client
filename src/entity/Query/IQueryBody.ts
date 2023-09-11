import { type IEndpoint } from '../Abstract/IEndpoint'
import type IAbstractBody from '../Abstract/IAbstractBody'
import type IUserBody from '../User/IUserBody'
import { type IWorkPackageCollectionBody } from '../WP/WorkPackageCollection'
import { type QueryColumnBody } from './QueryColumn'
import { type QuerySortByBody } from './QuerySortBy'
import { type WithTimestamps } from '../Abstract/IAbstractBody'

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
  _type?: `${string}QueryFilter`
  name?: string
  values?: string[]
  _links: {
    schema?: IEndpoint
    filter: IEndpoint
    operator: IEndpoint
    values?: IEndpoint[]
  }
}

/** https://www.openproject.org/docs/api/endpoints/queries/ */
export default interface IQueryBody extends IAbstractBody, WithTimestamps {
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
  externalId: string // XXX ref to meteor-1c
  externalCanbanId: string // XXX ref to meteor-1c
  _embedded?: {
    user: IUserBody
    sortBy: QuerySortByBody[]
    columns: QueryColumnBody[]
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
