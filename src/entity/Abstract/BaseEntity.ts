import { IEndpoint } from "./IEndpoint";
import IAbstractBody from "./IAbstractBody";
import set from "keypather/set";
import get from "keypather/get";
import IWPBody from "../WP/IWPBody";
import entityManager, {
  EntityManager,
  GetAllOptions,
  GetManyOptions,
} from "../../EntityManager/EntityManager";
import { CollectionFilterItem } from "contracts/CollectionFilterItem";

interface IPartialAbstractBody extends Partial<Omit<IWPBody, "_links">> {
  _links?: Partial<IAbstractBody["_links"]>;
}

// type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;

// interface EntityRow {
//   find<T extends Abstract>(this: T, id: number | bigint): Promise<InstanceType<T>>;
// }

export class EntityRequestBuilder<T extends BaseEntity> {
  private service?: EntityManager;
  private entity: any;
  private requstParams: GetManyOptions;
  constructor(T: any, requstParams?: GetManyOptions, service?: EntityManager) {
    this.entity = T;
    this.service = service || entityManager;
    this.requstParams = requstParams || {};
  }

  public useService(service?: EntityManager): this {
    if (service) this.service = service;
    return this;
  }

  public filters(filters: CollectionFilterItem[]): this {
    this.requstParams.filters = filters;
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

  public async first() {
    return await this.service.first<T>(this.entity, this.requstParams.filters);
  }

  public async getAll(options: GetAllOptions) {
    return await this.service.getAll<T>(this.entity, {
      ...this.requstParams,
      ...options,
    });
  }

  public async getMany(options: GetManyOptions) {
    return await this.service.getMany<T>(this.entity, {
      ...this.requstParams,
      ...options,
    });
  }
}

export default class BaseEntity {
  ["constructor"]: typeof BaseEntity;

  static url = "/should_be_defined";
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

  public static request<Entity extends BaseEntity>(this: Entity) {
    return new EntityRequestBuilder<Entity>(this);
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

  public static async findOrFail<Entity extends BaseEntity>(
    id: number | bigint
  ): Promise<Entity> {
    return entityManager.findOrFail<Entity>(this, id);
  }

  // public find<Entity extends Abstract>(this: Entity, id: number | bigint) {
  //   return entityManager.find<Entity>(this, id)
  // }
}
