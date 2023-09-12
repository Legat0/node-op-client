import { type EntityFilterItem } from 'contracts/EntityFilterItem'
import { type IEndpoint } from 'entity/Abstract/IEndpoint'
import type IAbstractBody from '../Abstract/IAbstractBody'
import { type WithTimestamps } from '../Abstract/IAbstractBody'

export enum GridTypeEnum {
  free = 'free',
  action = 'action',
}
export enum GridWidgetTypeEnum {
  work_package_query = 'work_package_query',
  work_packages_table = 'work_packages_table',
  work_packages_overview = 'work_packages_overview',
  custom_text = 'custom_text',
  project_status = 'project_status',
  project_description = 'project_description',
  project_details = 'project_details',
  members = 'members',
}

export interface GridWidgetQueryOptions {
  queryId: number
  filters?: EntityFilterItem[]
}
export interface GridWidgetOptions extends GridWidgetQueryOptions {
  /** project_description, work_packages_overview */
  name?: string
}

export interface IGridWidgetBody<OptionsType extends GridWidgetOptions = GridWidgetOptions> {
  _type: 'GridWidget'
  identifier: GridWidgetTypeEnum
  startRow: number
  endRow: number
  startColumn: number
  endColumn: number
  options?: OptionsType
}

export interface BoardGridOptions {
  type: GridTypeEnum
  attribute?: 'status' | 'assignee' | 'version' | 'subproject' | 'subtasks' | null
  highlightingMode?: 'priority' | string
  filters?: EntityFilterItem[]
}
export type GridOptions = Partial<BoardGridOptions> & Record<string, any>

export default interface IGridBody<T extends GridOptions = GridOptions> extends IAbstractBody, WithTimestamps {
  _type: 'Grid'
  name: string
  rowCount: number
  columnCount: number
  options: T
  widgets: IGridWidgetBody[]
  _links: {
    self: IEndpoint
    scope:
    {
      href: string
      type: 'text/html'
    }
  }
}
