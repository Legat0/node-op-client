import { type IEndpoint } from '../Abstract/IEndpoint'
import type IAbstractBody from '../Abstract/IAbstractBody'
import type IFieldSchema from '../Schema/IFieldSchema'
import type ICollection from '../Schema/ICollection'
import { type QueryFilterInstanceSchemaBody } from './QueryFilterInstanceSchema'

/** Описание полей модели Query */
export interface QueryFormSchema {
  _type: 'Schema'
  // Поля
  id: IFieldSchema<'Integer'>
  name: IFieldSchema<'String'>
  createdAt: IFieldSchema<'DateTime'>
  updatedAt: IFieldSchema<'DateTime'>
  user: IFieldSchema<'User'>
  project: IFieldSchema<'Project'>
  public: IFieldSchema<'Boolean'>
  sums: IFieldSchema<'Boolean'>
  timelineVisible: IFieldSchema<'Boolean'>
  timelineZoomLevel: IFieldSchema<'String'>
  timelineLabels: IFieldSchema<'QueryTimelineLabels'>
  highlightingMode: IFieldSchema<'String'>
  displayRepresentation: IFieldSchema<'String'>
  showHierarchies: IFieldSchema<'Boolean'>
  starred: IFieldSchema<'Boolean'>
  hidden: IFieldSchema<'Boolean'>
  orderedWorkPackages: IFieldSchema<'QueryOrder'>
  includeSubprojects: IFieldSchema<'Boolean'>
  columns: IFieldSchema<'[]QueryColumn'>
  filters: IFieldSchema<'[]QueryFilterInstance'>
  groupBy: IFieldSchema<'[]QueryGroupBy'>
  highlightedAttributes: IFieldSchema<'[]QueryColumn'>
  sortBy: IFieldSchema<'[]QuerySortBy'>
  results: IFieldSchema<'WorkPackageCollection'>

  _dependencies: any[]
  _embedded: {
    filtersSchemas: ICollection<QueryFilterInstanceSchemaBody>
  }

  _links: {
    self: IEndpoint
  }
}

export default interface IQueryFormBody extends IAbstractBody<''> {
  _type?: 'Form'
  _embedded: {
    payload: {
      starred: boolean
      name: string
      filters: object[]
      includeSubprojects: boolean
      public: boolean
      timelineVisible: boolean
      showHierarchies: boolean
      timelineZoomLevel: 'auto' | string
      timelineLabels: object
      highlightingMode: 'inline' | string
      _links: {
        project: IEndpoint
        sortBy: IEndpoint[]
        groupBy: IEndpoint
        columns: IEndpoint[]
        highlightedAttributes: IEndpoint[]

      }
    }
    schema: QueryFormSchema
  }
  _links: {
    self: IEndpoint
  }
}
