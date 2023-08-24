import { IEndpoint } from "./IEndpoint";
import IAbstractBody, { ISchemaBody } from "./IAbstractBody";
import set from "keypather/set";
import get from "keypather/get";
import IWPBody from "../WP/IWPBody";
import {
  EntityManager,
  GetAllOptions,
  GetManyOptions,
} from "../../EntityManager/EntityManager";
import {
  EntityFieldFilter,
  EntityFilterItem,
} from "contracts/EntityFilterItem";
import { FilterOperatorType } from "contracts/FilterOperatorEnum";
import EntityRequestBuilder from "./EntityRequestBuilder";
import date2str from "../utils/date2str";
import Duration from "./Duration";
import str2date from "../utils/str2date";
import User from "entity/User/User";
import BaseEntityAny, { EntityCollectionElement } from "./BaseEntityAny";

export type MapFieldType = Record<string | "marks", string | undefined>;

type StringOrInteger = string | number;

export default abstract class BaseEntity extends BaseEntityAny<number> {
  /** Массив измененных полей */
  public $dirty: string[] = [];

  /** Маппинг доп полей. alias => real name */
  private $mapField?: MapFieldType;

  public useMapField(map: MapFieldType) {
    this.$mapField = map;
    return this;
  }

  public getFieldName(alias: string): string {
    return this.$mapField?.[alias] || alias;
  }

  public static request<T extends BaseEntity>(
    this: { new (): T },
    options?: GetManyOptions,
    map?: MapFieldType
  ) {
    return new EntityRequestBuilder<T>(this, options, undefined, map);
  }

  public static async findBy<T extends BaseEntity>(
    this: { new (): T },
    key: keyof T["body"] | string,
    value: any
  ): Promise<EntityCollectionElement<T> | null> {
    const filter = {
      [key]: { operator: "=" as FilterOperatorType, values: [value] },
    };

    return await EntityManager.instance.first<T>(this, [filter]);
  }

  public static async first<T extends BaseEntity>(
    this: { new (): T },
    filters?: EntityFilterItem[]
  ) {
    return await EntityManager.instance.first<T>(this, filters);
  }

  public async create<Entity extends this>(
    this: Entity,
    options?: {
      notify?: boolean;
    }
  ) {
    return await this.getService().create(this, options);
  }

  public async patch<Entity extends this>(
    this: Entity,
    options?: {
      fieldPaths?: Array<keyof Entity["body"] | string>;
      notify?: boolean;
    }
  ) {
    return await this.getService().patch(
      this,
      options?.fieldPaths,
      options?.notify
    );
  }

  public async save<T2 extends this>(
    this: T2,
    options?: {
      fieldPaths?: Array<keyof T2["body"] | string>;
      notify?: boolean;
    }
  ) {
    if (this.id) {
      return this.patch(options);
    } else {
      return this.create(options);
    }
  }
}
