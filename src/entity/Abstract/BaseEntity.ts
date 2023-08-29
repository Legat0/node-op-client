import {
  EntityManager,
  type GetManyOptions
} from '../../EntityManager/EntityManager'
import {
  type EntityFilterItem
} from '../../contracts/EntityFilterItem'
import { type FilterOperatorType } from '../../contracts/FilterOperatorEnum'
import EntityRequestBuilder from './EntityRequestBuilder'
import BaseEntityAny, { type EntityCollectionElement } from './BaseEntityAny'

export type MapFieldType = Record<string | 'marks', string | undefined>

export default abstract class BaseEntity extends BaseEntityAny<number> {
  /** Массив измененных полей */
  public $dirty: string[] = []

  /** Маппинг доп полей. alias => real name */
  private $mapField?: MapFieldType

  public useMapField (map: MapFieldType): this {
    this.$mapField = map
    return this
  }

  public getFieldName (alias: string): string {
    return this.$mapField?.[alias] ?? alias
  }

  public static request<T extends BaseEntity>(
    this: new () => T,
    options?: GetManyOptions,
    map?: MapFieldType
  ): EntityRequestBuilder<T> {
    return new EntityRequestBuilder<T>(this, options, undefined, map)
  }

  public static async findBy<T extends BaseEntity>(
    this: new () => T,
    key: keyof T['body'] | string,
    value: any
  ): Promise<EntityCollectionElement<T> | null> {
    const filter = {
      [key]: { operator: '=' as FilterOperatorType, values: [value] }
    }

    return await EntityManager.instance.first<T>(this, [filter])
  }

  public static async first<T extends BaseEntity>(
    this: new () => T,
    filters?: EntityFilterItem[]
  ): Promise<EntityCollectionElement<T> | null> {
    return await EntityManager.instance.first<T>(this, filters)
  }

  public async create<Entity extends this>(
    this: Entity,
    options?: {
      notify?: boolean
    }
  ): Promise<Entity> {
    return await this.getService().create(this, options)
  }

  public async patch<Entity extends this>(
    this: Entity,
    options?: {
      fieldPaths?: Array<keyof Entity['body'] | string>
      notify?: boolean
    }
  ): Promise<Entity> {
    return await this.getService().patch(
      this,
      options?.fieldPaths,
      options?.notify
    )
  }

  public async save<T2 extends this>(
    this: T2,
    options?: {
      fieldPaths?: Array<keyof T2['body'] | string>
      notify?: boolean
    }
  ): Promise<T2> {
    if (this.id > 0) {
      return await this.patch(options)
    } else {
      return await this.create(options)
    }
  }
}
