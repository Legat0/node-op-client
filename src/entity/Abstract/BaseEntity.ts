import { IEndpoint } from "./IEndpoint";
import IAbstractBody from "./IAbstractBody";
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

export interface IPartialAbstractBody extends Partial<IAbstractBody> {}

// interface IPartialAbstractBody extends Partial<Omit<IWPBody, "_links">> {
//   _links?: Partial<IAbstractBody["_links"]>;
// }

// type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;

// interface EntityRow {
//   find<T extends Abstract>(this: T, id: number | bigint): Promise<InstanceType<T>>;
// }

export default abstract class BaseEntity {
  ["constructor"]: typeof BaseEntity;

  static url: string = "/should_be_defined";

  /** Массив измененных полей */
  public $dirty: string[] = [];

  body: IAbstractBody;
  /**
   * Holds linked objects matched the body._links.
   */
  _links: { [key: string]: BaseEntity };

  private $service?: EntityManager;

  constructor(init?: number | bigint | IEndpoint | IPartialAbstractBody) {
    this.body = {
      id: undefined,
      _links: {
        self: undefined,
      },
      _embedded: {},
    };
    this._links = {};
    if (init !== undefined) {
      if (typeof init === "number" || typeof init === "bigint") {
        this.id = Number(init);
      } else if (typeof init === "object" && init.hasOwnProperty("href")) {
        this.self = init as IEndpoint;
      } else {
        this.merge(init);
        if (this.id && !this.self) {
          this.id = this.id;
        }
        if (this.self && !this.id) {
          this.self = this.self;
        }
      }
    }
  }

  public useService(service?: EntityManager): this {
    if (service) this.$service = service;
    return this;
  }

  public getService(): EntityManager {
    if (!this.$service) throw new Error("service is undefined");

    return this.$service;
  }

  public static request<T extends BaseEntity>(
    this: { new() : T},
    options?: GetManyOptions
  ) {
    return new EntityRequestBuilder<T>(this, options);
  }

  get id(): number {
    return this.body.id;
  }

  set id(id: number) {
    this.body.id = id;
    this.body._links.self = this.body._links.self || { href: undefined };
    this.body._links.self.href = this.constructor.url + "/" + id;
    this.body._links.self.title = undefined;
  }

  merge(source) {
    const copy = JSON.parse(JSON.stringify(source)) as IAbstractBody;
    Object.assign(this.body, copy);
  }

  get self() {
    return this.body._links.self;
  }

  set self(value) {
    this.body._links.self = value;
    this.body.id = Number.parseInt(value.href.match(/\d+$/)[0]);
  }

  get bodyCustomFields() {
    const map = new Map<string, any>()
    for (const key in this.body) {
      if (key.includes('customField')) {
        map.set(key, this.body[key])
      }      
    }
    return map
  }

  get linkCustomFields() {
    const map = new Map<string, any>()    
    for (const key in this.body._links) {
      if (key.includes('customField')) {
        map.set(key, this.body._links[key])
      }      
    }
    return map
  }

  bodyScope(
    fieldPaths: Array<string | number | Symbol>
  ): Partial<IAbstractBody> {
    const result: Partial<IAbstractBody> = {};
    fieldPaths.forEach((eachFieldPath) => {
      const eachFieldValue = get(this.body, eachFieldPath);
      set(result, eachFieldPath, eachFieldValue);
    });
    return result;
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

  public static async findOrFail<T extends BaseEntity>(this: { new(): T},
    id: number | bigint
  ): Promise<T> {
    return EntityManager.instance.findOrFail<T>(this, id);
  }

  public static async first<T extends BaseEntity>(
    this: { new(): T},
    filters?: EntityFilterItem[]
  ) {    
    return await EntityManager.instance.first<T>(this, filters);
  }

  public static async findBy<T extends BaseEntity>(
    this: { new(): T},
    key: keyof T["body"] | string,
    value: any
  ): Promise<T | null> {
    const filter = {
      [key]: { operator: "=" as FilterOperatorType, values: [value] },
    };
   
    return await EntityManager.instance.first<T>(this, [filter]);
  }

  public static async getAll<T extends BaseEntity>(this: { new(): T}, options?: GetAllOptions) {
    return await EntityManager.instance.getAll<T>(this, options);
  }

  public static async getMany<T extends BaseEntity>(this: { new(): T}, options?: GetManyOptions) {
    return await EntityManager.instance.getMany<T>(this, options);
  }

}

