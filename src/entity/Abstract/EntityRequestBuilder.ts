import {
  EntityFieldFilter,
  EntityFilterItem,
} from "../../contracts/EntityFilterItem";
import {
  EntityManager,
  GetAllOptions,
  GetManyOptions,
} from "../../EntityManager/EntityManager";
import BaseEntity, { MapFieldType } from "./BaseEntity";

export default class EntityRequestBuilder<T extends BaseEntity> {
  private service: EntityManager;
  private entity: { new (): T };
  private requstParams: GetManyOptions & Required<Pick<GetManyOptions, 'filters'>>;
  private mapField?: MapFieldType;

  constructor(
    T: { new (...args: any[]): T },
    requstParams?: GetManyOptions,
    service?: EntityManager,
    map?: MapFieldType
  ) {
    this.entity = T;
    this.service = service || EntityManager.instance;
    this.requstParams = Object.assign({ filters: [] }, requstParams);
    this.mapField = map;
  }

  public useService(service?: EntityManager): this {
    if (service) this.service = service;
    return this;
  }

  public useMapField(map: MapFieldType) {
    this.mapField = map;
    return this;
  }

  public addFilters(filters: EntityFilterItem[]): this {
    this.requstParams.filters = this.requstParams.filters.concat(filters);
    return this;
  }
  public addFilter(
    key: keyof T["body"] | string,
    operator: EntityFieldFilter["operator"],
    values?: EntityFieldFilter["values"]
  ): this {
    key = this.mapField?.[String(key)] || key;
    const filter: EntityFilterItem = { [key]: { operator, values } };  
    this.requstParams.filters.push(filter);
    return this;
  }

  public offset(offset: number): this {
    this.requstParams.offset = offset;
    return this;
  }

  public pageSize(pageSize: number): this {
    this.requstParams.pageSize = pageSize;
    return this;
  }

  public groupBy(column: string): this {
    this.requstParams.groupBy = column;
    return this;
  }

  /** list of properties to include.
   * Example: total,elements/subject,elements/id,self */
  public select(
    selectProps: Array<
      | "self"
      | "project"
      | "author"
      | "assignee"
      | "responsible"
      | "_type"
      | "id"
      | "subject"
      | "startDate"
      | "dueDate"
      | "date"
      | "*"
    >,
    // selectProps: Array<keyof T["body"] | `customField${number}` | string>, // TODO доработка бэка OP для фильтрации
    globalSelect: Array<
      "total" | "count" | "pageSize" | "offset" | "_type" | "*"
    > = ["*"]
  ): this {
    // Поддерживаются варианты self, project, author, assignee, responsible, _type, id, subject, startDate, dueDate, date, *.
    this.requstParams.select = [];
    this.requstParams.select = this.requstParams.select
      .concat(globalSelect)
      .concat(
        selectProps
          .map((x) => this.mapField?.[String(x)] || x)
          .map((x) => `elements/${String(x)}`)
      );
    return this;
  }

  public sortBy(column: string, direction: "asc" | "desc" = "asc"): this {
    if (this.requstParams.sortBy === undefined)
      this.requstParams.sortBy = new Map();

    column = this.mapField?.[String(column)] || column;
    this.requstParams.sortBy.set(column, direction);
    return this;
  }

  public async first() {
    return await this.service.first<T>(this.entity, this.requstParams.filters);
  }

  public async getAll(options?: GetAllOptions) {    
    return await this.getMany(options)  
  }

  public async getMany(options?: GetManyOptions) {
    const resultFilters = this.requstParams.filters.concat(options?.filters||[])
    return await this.service.getMany<T>(this.entity, {
      ...this.requstParams,
      ...options,
      filters: resultFilters
    });
  }
}
