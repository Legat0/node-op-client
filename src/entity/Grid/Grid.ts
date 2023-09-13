import Field from '../decorators/Field'
import BaseEntity from '../Abstract/BaseEntity'
import type IGridBody from './IGridBody'
import { GridOptions, type GridWidgetOptions, GridWidgetTypeEnum, type IGridWidgetBody, type GridWidgetQueryOptions, type GridTypeEnum, type BoardGridOptions } from './IGridBody'
import { type EntityFilterItem } from '../../contracts/EntityFilterItem'
import Query from '../Query/Query'
import { type IEndpoint } from '../Abstract/IEndpoint'
import Project from '../Project/Project'

export class GridWidget implements IGridWidgetBody {
  _type: 'GridWidget' = 'GridWidget'
  identifier: GridWidgetTypeEnum
  startRow: number = 1
  endRow: number = 2
  startColumn: number = 1
  endColumn: number = 2
  options?: GridWidgetOptions

  constructor (identifier: GridWidgetTypeEnum, options?: GridWidgetOptions) {
    this.identifier = identifier
    this.options = options
  }

  public setPosition (startColumn: number, startRow: number): this {
    this.startColumn = startColumn
    this.startRow = startRow
    return this
  }

  public setSize (columns: number, rows: number): this {
    this.columns = columns
    this.rows = rows
    return this
  }

  public setStartColumn (startColumn: number): this {
    const columns = this.columns
    this.startColumn = startColumn
    this.columns = columns
    return this
  }

  public setStartRow (startRow: number): this {
    const rows = this.rows
    this.startRow = startRow
    this.rows = rows
    return this
  }

  public get columns (): number {
    return this.endColumn - this.startColumn
  }

  public set columns (columns: number) {
    this.endColumn = this.startColumn + columns
  }

  public get rows (): number {
    return this.endRow - this.startRow
  }

  public set rows (rows: number) {
    this.endRow = this.startRow + rows
  }

  public fill (data: IGridWidgetBody): this {
    Object.assign(this, data)
    return this
  }
}

export class GridWidgetQuery extends GridWidget {
  identifier: GridWidgetTypeEnum = GridWidgetTypeEnum.work_package_query
  options: GridWidgetQueryOptions

  constructor (query: number | Query, filters?: EntityFilterItem[]) {
    const queryModel = new Query(query)
    const options: GridWidgetQueryOptions = {
      queryId: queryModel.id,
      filters: filters ?? queryModel.queryFilters
    }
    super(GridWidgetTypeEnum.work_package_query, options)
  }

  public get filters (): EntityFilterItem[] {
    return this.options.filters ?? []
  }

  public set filters (v: EntityFilterItem[]) {
    this.options.filters = v
  }

  public get queryId (): number {
    return this.options.queryId
  }

  public set queryId (v: number) {
    this.options.queryId = v
  }
}

export default class Grid extends BaseEntity {
  static url = '/api/v3/grids'

  constructor (
    ...args: ConstructorParameters<typeof BaseEntity>
  ) {
    super(...args)
    Object.assign(this.body, { options: {}, widgets: [], rowCount: 1, columnCount: 1 })
  }

  body: IGridBody

  @Field()
    name: string

  @Field()
    rowCount: number = 1

  @Field()
    columnCount: number = 1

  @Field()
    options: GridOptions

  // @Field()
  //   widgets: IGridWidgetBody[]

  public get widgets (): IGridWidgetBody[] {
    return this.body.widgets
  }

  public set widgets (v: IGridWidgetBody[]) {
    this.body.widgets = v
  }

  get scope (): string {
    return this.body._links.scope.href ?? ''
  }

  set scope (v: string | IEndpoint) {
    const href = (typeof v === 'object' && 'href' in v) ? v.href : v
    this.body._links.scope = {
      href: href ?? '',
      type: 'text/html'
    }
  }

  public addWidget (widget: GridWidget): this {
    this.widgets = this.widgets.concat([widget])
    return this
  }

  private attachments (): this {
    // TODO
    return this
  }

  private addAttachment (): this {
    // TODO
    return this
  }
}

export class BoardGrid extends Grid {
  body: IGridBody<BoardGridOptions>

  public get type (): GridTypeEnum {
    return this.body.options.type
  }

  public set type (v: GridTypeEnum) {
    this.body.options.type = v
  }

  public get filters (): EntityFilterItem[] {
    return this.body.options.filters ?? []
  }

  public set filters (v: EntityFilterItem[]) {
    this.body.options.filters = v
  }

  public get attribute (): BoardGridOptions['attribute'] | null {
    return this.body.options.attribute ?? null
  }

  public set attribute (v: BoardGridOptions['attribute'] | null) {
    this.body.options.attribute = v
  }

  public get widgets (): IGridWidgetBody[] {
    return super.widgets
  }

  public set widgets (v: IGridWidgetBody[]) {
    super.widgets = v
    this.columnCount = v.length + 1
  }

  // get scopeProject (): Project {
  //   // TODO fix
  //   return new Project({ href: `/api/v3/${this.scope.replace('/boards','')}` })
  // }

  public setScopeProject (v: string | Project): this {
    const identifier = (v instanceof Project) ? v.id : v
    this.scope = `projects/${identifier}/boards`
    return this
  }

  /** Добавление виджета-колонки в конец или в позицию startColumn  */
  public addColumn (queryColumn: GridWidgetQuery, startColumn?: number): this {
    if (startColumn != null) {
      // Сдвиг колонок
      let moveColumn = startColumn
      for (const widget of this.widgets) {
        if (widget.startColumn === moveColumn) {
          widget.startColumn++
          widget.endColumn++
          moveColumn = widget.startColumn
        }
      }
      // Вставка колонки
      queryColumn.startColumn = startColumn
      this.addWidget(queryColumn)
      return this
    } else {
      // Вставка в конец
      queryColumn.setStartColumn(this.widgets.length + 1)

      return this.addWidget(queryColumn)
    }
  }

  // TODO createColumn
  // public createColumn (name: string, filters: InputQueryFilterInstance[]): this {
  //   // return this.addWidget(queryColumn)
  //   // const query = new Query()
  //   // query.project = new Project(this.s) // TODO get project id from scope
  //   // query.name = 'Список досок без имени'
  //   // query.addManualSortFilter() // or other filters
  //   // await query.save()
  //   // newBoard.addColumn(new GridWidgetQuery(query))
  //   // try {
  //   //   await newBoard.save()
  //   // } catch (error) {
  //   //   await query.delete()
  //   // }
  //   return this
  // }

  public removeColumn (query: number | Query): this {
    const queryModel = new Query(query)
    const index = this.widgets.findIndex(x => x.options?.queryId === queryModel.id)
    if (index >= 0) {
      this.body.widgets.splice(index, 1)
      this.columnCount = this.body.widgets.length + 1
    } else {
      throw new Error(`widget with options.queryId=${queryModel.id} not found`)
    }
    return this
  }
}
