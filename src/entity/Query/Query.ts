import Field from '../decorators/Field'
import Link from '../decorators/Link'
import BaseEntity from '../Abstract/BaseEntity'
import type IQueryBody from './IQueryBody'
import QueryForm from './QueryForm'
import BaseEntityAny, { LinkEntity } from '../Abstract/BaseEntityAny'
import Project from '../Project/Project'
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
import QueryFilter from './QueryFilter'
import QueryOperator from './QueryOperator'
import { FilterOperatorEnum, type FilterOperatorType } from '../../contracts/FilterOperatorEnum'
import { type IEndpoint } from '../Abstract/IEndpoint'
import type IWPBody from 'entity/WP/IWPBody'

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

export interface InputQueryFilterInstance {
  values?: Array<string | number>
  _links: {
    filter: QueryFilter | IEndpoint | string
    operator: QueryOperator | IEndpoint | FilterOperatorType
    values?: Array<BaseEntityAny | IEndpoint>
  }
}

export default class Query extends BaseEntity {
  public static url: string = '/api/v3/queries'

  body: IQueryBody

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
    project: LinkEntity<Project>

  @Link('user', User)
    user: LinkEntity<User>

  /** HAL-format */
  get filters (): QueryFilterInstance[] {
    return this.getField<QueryFilterInstance[]>('filters', Array) ?? []
  }

  /** HAL-format */
  set filters (filters: InputQueryFilterInstance[]) {
    this.body.filters = filters.map(filter => {
      return {
        values: filter.values,
        _links: {
          filter: filter._links.filter instanceof QueryFilter ? filter._links.filter.self : QueryFilter.make(filter._links.filter).self,
          operator: filter._links.operator instanceof QueryOperator ? filter._links.operator.self : QueryOperator.make(filter._links.operator).self,
          values: filter._links.values?.map(v => {
            return v instanceof BaseEntityAny ? v.self : v
          })
        }
      }
    })
  }

  /** query-format */
  public get queryFilters (): EntityFilterItem[] {
    const result: EntityFilterItem[] = []
    for (const filterItem of this.filters) {
      const filter = new QueryFilter(filterItem._links.filter)
      const operator = new QueryOperator(filterItem._links.operator)
      result.push({
        [filter.id]: {
          operator: operator.id as FilterOperatorType,
          values: filterItem.values ?? filterItem._links.values?.map(x => BaseEntityAny.idFromLink(x.href))
        }
      })
    }

    return result
  }

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

  @Field()
    externalId: string // XXX ref to meteor-1c

  @Field()
    externalCanbanId: string // XXX ref to meteor-1c

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

  public removeFilter (filter: QueryFilter | IEndpoint | string): this {
    const index = this.body.filters.findIndex(x => QueryFilter.make(x._links.filter ?? '').id === QueryFilter.make(filter).id)
    if (index >= 0) {
      this.body.filters.splice(index, 1)
    }
    return this
  }

  public addFilter (filter: QueryFilter | IEndpoint | string, operator: FilterOperatorType | QueryOperator | IEndpoint, values?: Array<BaseEntityAny | IEndpoint | string | number>): this {
    const filterItem: InputQueryFilterInstance = {
      values: undefined,
      _links: {
        filter,
        operator,
        values: undefined
      }
    }
    // const linkValues = values?.filter((x): x is IEndpoint => typeof x === 'object' && 'href' in x)
    const linkValues = values?.map((x) => {
      if (x instanceof BaseEntityAny) {
        return x.self
      } else if (typeof x === 'object' && 'href' in x) {
        return x
      }
      return undefined
    }).filter((x): x is IEndpoint => x != null)

    if (linkValues != null && linkValues.length > 0) {
      filterItem._links.values = linkValues
    }

    filterItem.values = values?.filter((x): x is string | number => typeof x === 'string' || typeof x === 'number') ?? []

    this.filters = [
      filterItem
    ].concat(this.filters)
    return this
  }

  public addManualSortFilter (): this {
    return this.addFilter('manualSort', FilterOperatorEnum.wp_manual_sort)
  }

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
    params?: QueryParamsType,
    signal?: AbortSignal | null
  ): Promise<Entity> {
    return await this.getService().refresh(
      this, params, signal
    )
  }

  public async loadResultPage (
    offset: number, signal?: AbortSignal | null
  ): Promise<this> {
    return await this.refresh({ offset }, signal)
  }

  /** TODO getAllResults see getAll() */
  public async loadAllResults (
    options: { threads?: number, signal?: AbortSignal | null } = {}
  ): Promise<this> {
    if (this.results.count < this.results.total) {
      const sema = this.getService().createSema(options.threads)

      const pageCount = Math.ceil(this.results.total / this.results.pageSize)
      const pages = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, i) => i + 2).map(async (offset: number): Promise<IWPBody[]> => {
          await sema?.acquire()
          try {
            const queryCopy = new Query(this.self)
            await queryCopy.refresh({ offset }, options.signal)
            return queryCopy.results.body._embedded.elements
          } finally {
            sema?.release()
          }
        })
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

  /**
   * Сохранение сортировки задач в Query
   * @param delta - объект с измененными сортировками задач, в формате {[wp_id]:new_position}
   */
  public async order (delta: Record<number, number>): Promise<void> {
    await this.getService().fetch(this.makeUrl('order'), {
      method: 'PATCH',
      body: delta
    })
  }
}
