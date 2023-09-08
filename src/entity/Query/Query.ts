import Field from '../decorators/Field'
import Link from '../decorators/Link'
import BaseEntity from '../Abstract/BaseEntity'
import type IQueryBody from './IQueryBody'
import QueryForm from './QueryForm'
import Project from '../Project/Project'
import type BaseEntityAny from '../Abstract/BaseEntityAny'
import { LinkEntity } from '../Abstract/BaseEntityAny'
import User from '../User/User'
import { DisplayRepresentationEnum, HighlightingModeEnum, TimelineZoomLevelEnum, type QueryFilterInstance } from './IQueryBody'
import Embedded from '../decorators/Embedded'
import WorkPackageCollection from '../WP/WorkPackageCollection'
import EmbeddedArray from '../decorators/EmbeddedArray'
import QueryColumn, { type QueryColumnBody } from './QueryColumn'
import QuerySortBy from './QuerySortBy'
import { type EntityFilterItem } from '../../contracts/EntityFilterItem'
import { type EntityFieldSchema } from '../WP/WPSchema'
import { type EntityFieldTypes } from '../Schema/IFieldSchema'

// export
export type QueryParamsType = Partial<{
  pageSize: number
  offset: number
  columns: string[]
  showSums: boolean
  timelineVisible: boolean
  highlightingMode: HighlightingModeEnum
  includeSubprojects: boolean
  showHierarchies: boolean
  groupBy: string
  filters: EntityFilterItem[]
  sortBy: Map<string, 'asc' | 'desc'>
}>

// TODO QueryParamsBuilder
export class QueryParamsBuilder {
  pageSize: number
  offset: number
  columns: string[]
}

// interface QueryRefresh {
//   refresh: <Entity extends BaseEntity>(
//     this: Entity,
//     params?: QueryParamsType
//   ) => Promise<Entity>
// }
export default class Query extends BaseEntity {
  public static url: string = '/api/v3/queries'

  @Field('name', String)
    name: string

  @Field('starred', Boolean)
  readonly starred: boolean

  @Field('sums', Boolean)
    sums: boolean

  @Field('createdAt', Date)
    createdAt: Date

  @Field('updatedAt', Date)
    updatedAt: Date

  @Link('project', Project)
    project?: LinkEntity<Project>

  @Link('user', User)
    user: LinkEntity<User>

  @Field('filters', Array)
    filters: QueryFilterInstance[]

  @Field('timelineVisible', Boolean)
    timelineVisible: boolean

  @Field('timelineLabels', Object)
    timelineLabels: object

  @Field('timelineZoomLevel', String)
    timelineZoomLevel: TimelineZoomLevelEnum

  @Field('highlightingMode', String)
    highlightingMode: HighlightingModeEnum

  @Field('showHierarchies', Boolean)
    showHierarchies: boolean

  @Field('public', Boolean)
    public: boolean

  @Field('displayRepresentation', String)
    displayRepresentation: DisplayRepresentationEnum = DisplayRepresentationEnum.list

  @Embedded('results', WorkPackageCollection)
    results: WorkPackageCollection

  @EmbeddedArray('columns', QueryColumn)
    columns: QueryColumn[]

  get columnsWithSchema (): Array<QueryColumnBody & { schema: EntityFieldSchema<EntityFieldTypes> | null } > {
    return this.body._embedded?.columns.map((column) => {
      const schema = this.results.getFieldSchema(column.id)
      return { ...column, schema }
    }) ?? []
  }

  @EmbeddedArray('sortBy', QuerySortBy)
    sortBy: QuerySortBy[]

  body: IQueryBody

  public static async form (query?: Query): Promise<QueryForm> {
    const result = await QueryForm.getService().fetch(QueryForm.url, {
      method: 'POST',
      body: query?.body
    })

    return new QueryForm(result)
  }

  public async form (): Promise<QueryForm> {
    const body = await this.getService().fetch(this.id > 0 ? this.self.href + '/form' : QueryForm.url, {
      method: 'POST',
      body: this.body
    })

    return new QueryForm(body)
  }

  public static async findOrFail<T extends BaseEntityAny>(
    this: new () => T,
    id: number | bigint,
    params?: QueryParamsType
  ): Promise<T> {
    return await super.getService().findOrFail<T>(this, id, params)
  }

  // public async refresh<Entity extends this>(
  //   this: Entity,
  //   params?: QueryParamsType
  // ): Promise<Entity> {
  //   return await this.getService().refresh(
  //     this, params
  //   )
  // }

  public async refresh<Entity extends this>(
    this: Entity,
    params?: QueryParamsType
  ): Promise<Entity> {
    return await this.getService().refresh(
      this, params
    )
  }

  public async loadResultPage (
    offset: number
  ): Promise<this> {
    return await this.refresh({ offset })
  }

  /** TODO getAllResults see getAll() */
  public async loadAllResults (
    options: { threads?: number } = {}
  ): Promise<this> {
    if (this.results.count < this.results.total) {
      const sema = this.getService().createSema(options.threads)

      const pageCount = Math.ceil(this.results.total / this.results.pageSize)

      const pages = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, i) => i + 2).map(async (offset) => {
          const queryCopy = new Query(this.self)
          await sema?.acquire()
          try {
            await queryCopy.refresh({ offset })
            return queryCopy.results.body._embedded.elements
          } finally {
            sema?.release()
          }
        }
        )
      )

      pages.forEach((page) => {
        if (this.body._embedded != null) {
          this.body._embedded.results._embedded.elements = this.body._embedded.results._embedded.elements.concat(page)
          this.body._embedded.results.count += page.length
        }
      })
    }
    return this
  }

  public async star (): Promise<void> {
    await this.getService().fetch(this.makeUrl('star'), {
      method: 'PATCH'
    })
    this.body.starred = true
  }

  public async unstar (): Promise<void> {
    await this.getService().fetch(this.makeUrl('unstar'), {
      method: 'PATCH'
    })
    this.body.starred = false
  }
}
