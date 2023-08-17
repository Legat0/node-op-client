import { EntityFieldFilter, EntityFilterItem } from "contracts/EntityFilterItem";
import { EntityManager, GetAllOptions, GetManyOptions } from "../../EntityManager/EntityManager";
import BaseEntity from "./BaseEntity";

export default class EntityRequestBuilder<T extends BaseEntity> {
  private service?: EntityManager;
  private entity: { new(): T};
  private requstParams: GetManyOptions;

  constructor(T: { new(): T}, requstParams?: GetManyOptions, service?: EntityManager) {
    this.entity = T;
    this.service = service || EntityManager.instance;
    this.requstParams = requstParams || { filters: [] };
  }

  public useService(service?: EntityManager): this {
    if (service) this.service = service;
    return this;
  }

  public filters(filters: EntityFilterItem[]): this {
    this.requstParams.filters = filters;
    return this;
  }
  public addFilter(
    key: keyof T["body"] | string,
    operator: EntityFieldFilter["operator"],
    values: EntityFieldFilter["values"]
  ): this {
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

  public groupBy(column : string): this {
    this.requstParams.groupBy = column;
    return this;
  }

  public sortBy(column : string, direction: 'asc' | 'desc' = 'asc'): this {
    if (this.requstParams.sortBy === undefined)  this.requstParams.sortBy = new Map()
    this.requstParams.sortBy.set(column, direction)
    return this;
  }

  public async first() {
    return await this.service.first<T>(this.entity, this.requstParams.filters);
  }

  public async getAll(options?: GetAllOptions) {
    return await this.service.getAll<T>(this.entity, {
      ...this.requstParams,
      ...options,
    });
  }

  public async getMany(options?: GetManyOptions) {
    return await this.service.getMany<T>(this.entity, {
      ...this.requstParams,
      ...options,
    });
  }
}
