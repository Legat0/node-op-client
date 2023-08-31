import {
  type ICollectionStat,
  EntityManager,
  type GetAllOptions,
  type GetManyOptions
} from '../../EntityManager/EntityManager'
import type User from '../User/User'
import str2date from '../utils/str2date'
import Duration from './Duration'
import type IAbstractBody from './IAbstractBody'
import { type IEndpoint } from './IEndpoint'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const set = require('keypather/set')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const get = require('keypather/get')

export interface IPartialAbstractBody
  extends Partial<IAbstractBody<number | string>> {}

// interface IPartialAbstractBody extends Partial<Omit<IWPBody, "_links">> {
//   _links?: Partial<IAbstractBody["_links"]>;
// }

export type LinkEntity<T extends BaseEntityAny> = Pick<
T,
'id' | 'self' | 'parseSelf' | 'makeUrl'
> &
(T extends User ? Pick<User, 'avatarUrl'> : unknown)

// export type OmitEmbedded<T> = {
//   [K in keyof T as K extends `embedded${string}` ? never : K]: T[K];
// };

export type EmbeddedFieldName = `embedded${string}`

export type EntityCollectionElement<T extends BaseEntityAny<string | number>> =
  {
    [Filtered in {
      [K in keyof T]: K extends EmbeddedFieldName ? never : K;
    }[keyof T]]: T[Filtered];
    // [K in keyof T as K extends EmbeddedFieldName ? never : K]: T[K];
  }

abstract class WithService {
  protected $service?: EntityManager

  constructor () {
    this.$service = EntityManager.instance
  }

  public useService (service?: EntityManager): this {
    if (service != null) this.$service = service
    return this
  }

  public getService (): EntityManager {
    if (this.$service == null) throw new Error('service is null')

    return this.$service
  }

  public static getService (): EntityManager {
    return EntityManager.instance
  }
}

export default abstract class BaseEntityAny<
  IdType extends string | number = string | number
> extends WithService {
  ['constructor']: typeof BaseEntityAny

  static url: string = '/should_be_defined'

  // TODO rename to $source or $body
  body: IAbstractBody<IdType>
  /**
   * Holds linked objects matched the body._links.
   */
  _links: Record<string, | BaseEntityAny
  | LinkEntity<BaseEntityAny>
  | BaseEntityAny[]
  | Array<LinkEntity<BaseEntityAny>>
  | null>

  // private $service?: EntityManager;

  constructor (
    init?: number | bigint | string | IEndpoint | IPartialAbstractBody
  ) {
    super()
    this.body = {
      id: 0 as IdType,
      _links: {
        self: { href: null }
      },
      _embedded: {}
    }
    this._links = {}
    if (init !== undefined) {
      if (typeof init === 'number' || typeof init === 'bigint') {
        this.id = Number(init) as IdType
      } else if (typeof init === 'string') {
        this.id = init as IdType
      } else if (typeof init === 'object' && Object.prototype.hasOwnProperty.call(init, 'href')) {
        this.self = init as IEndpoint
      } else {
        this.fill(init)
        // Init ID and href
        if (!(this.body.id === '' || this.body.id === 0) && this.self.href == null) {
          this.id = this.body.id
        }
        if (this.self.href != null && (this.body.id === '' || this.body.id === 0)) {
          this.self = this.body._links.self
        }
      }
    }
  }

  /** For json CustomOptions */
  public parseSelf<T extends object>(): T | undefined {
    try {
      return (this.self.title != null) ? (JSON.parse(this.self.title) as T) : undefined
    } catch (error) {
      return undefined
    }
  }

  public get selfParsed (): object | undefined {
    return this.parseSelf()
  }

  public getFieldName (alias: string): string {
    return alias
  }

  get id (): IdType {
    return this.body.id
  }

  set id (id: IdType) {
    this.body.id = id
    this.body._links.self = this.body._links.self ?? { href: undefined }
    this.body._links.self.href =
      this.constructor.url + '/' + encodeURIComponent(id)
    this.body._links.self.title = undefined
  }

  fill (source: object): this {
    const copy = JSON.parse(JSON.stringify(source)) as IAbstractBody
    Object.assign(this.body, copy)
    return this
  }

  static idFromLink (href: string | null): string {
    const idPart = (href ?? '').split('/').pop()?.split('?')[0]
    return decodeURIComponent(idPart ?? '')
  }

  get self (): IEndpoint {
    return this.body._links.self
  }

  set self (value: IEndpoint) {
    this.body._links.self = value
    const id = (value.href != null) ? BaseEntityAny.idFromLink(value.href) : ''
    const intId = Number.parseInt(id)
    this.body.id = (intId > 0 ? intId : id) as IdType
  }

  get bodyCustomFields (): Map<string, any> {
    const map = new Map<string, any>()
    for (const key in this.body) {
      if (key.includes('customField')) {
        map.set(key, this.body[key])
      }
    }
    return map
  }

  get linkCustomFields (): Map<string, any> {
    const map = new Map<string, any>()
    for (const key in this.body._links) {
      if (key.includes('customField')) {
        map.set(key, this.body._links[key])
      }
    }
    return map
  }

  bodyScope (
    fieldPaths: Array<string | number | symbol>
  ): Partial<IAbstractBody> {
    const result: Partial<IAbstractBody> = {}
    fieldPaths.forEach((eachFieldPath) => {
      const eachFieldValue = get(this.body, eachFieldPath)
      set(result, eachFieldPath, eachFieldValue)
    })
    return result
  }

  public getLinkArray<T extends BaseEntityAny>(
    key: string,
    Type: new (...args: any[]) => T
  ): Array<LinkEntity<T>> | undefined {
    key = this.getFieldName(key)
    if (Object.prototype.hasOwnProperty.call(this.body._links, key)) {
      const linkSelf = this.body._links[key]
      if (this._links[key] !== undefined && Array.isArray(this._links[key])) { return this._links[key] as Array<LinkEntity<T>> }

      if (Array.isArray(linkSelf)) {
        return (this._links[key] = linkSelf.map(
          (x) => new Type(x) as LinkEntity<T>
        ))
      } else {
        throw new Error('link value is not array')
      }
    }
  }

  public getLink<T extends BaseEntityAny>(
    key: string,
    Type: new (...args: any[]) => T
  ): LinkEntity<T> | null | undefined {
    key = this.getFieldName(key)
    if (Object.prototype.hasOwnProperty.call(this.body._links, key)) {
      const linkSelf = this.body._links[key]
      if (this._links[key] !== undefined) { return this._links[key] as LinkEntity<T> }

      if (linkSelf.href != null) {
        return (this._links[key] = new Type(linkSelf) as LinkEntity<T>)
      } else {
        return (this._links[key] = null)
      }
    }
  }

  public static convertToType (value: any, type?: any): any {
    if (type === Date) {
      return str2date(value)
    } else if (type === Duration) {
      return value != null ? Duration.parse(value) : null
    } else {
      return value
    }
  }

  public getField<T>(
    name: string,
    type: new (...args: any[]) => T
  ): T | undefined {
    name = this.getFieldName(name)
    if (name === '') return
    if (Object.prototype.hasOwnProperty.call(this.body, name)) {
      return BaseEntityAny.convertToType(this.body[name], type)
    }
  }

  public getJsonField<T>(
    name: string,
    Type?: new (...args: any[]) => T
  ): T | T[] | undefined {
    name = this.getFieldName(name)
    if (name === '') return

    if (Object.prototype.hasOwnProperty.call(this.body, name)) {
      const value = this.body[name] != null ? JSON.parse(this.body[name]) : null
      if (Type !== undefined) {
        if (Array.isArray(value)) {
          return value.map((x) => new Type(x))
        } else {
          return new Type(value)
        }
      } else {
        return value
      }
    }
  }

  public makeUrl (path: string): string {
    return this.getService().makeUrl(
      this.self.href + (path.toString().startsWith('/') ? '' : '/') + path
    )
  }

  public static async findOrFail<T extends BaseEntityAny>(
    this: new () => T,
    id: number | bigint
  ): Promise<T> {
    return await EntityManager.instance.findOrFail<T>(this, id)
  }

  public static async getAll<T extends BaseEntityAny>(
    this: new () => T,
    options?: GetAllOptions
  ): Promise<Array<EntityCollectionElement<T>>> {
    return await EntityManager.instance.getAll<T>(this, options)
  }

  /** alias getPage */
  public static async getMany<T extends BaseEntityAny>(
    this: new () => T,
    options?: GetManyOptions,
    stat?: ICollectionStat
  ): Promise<Array<EntityCollectionElement<T>>> {
    return await EntityManager.instance.getPage<T>(this, options, stat)
  }

  public static async getPage<T extends BaseEntityAny>(
    this: new () => T,
    options?: GetManyOptions,
    stat?: ICollectionStat
  ): Promise<Array<EntityCollectionElement<T>>> {
    return await EntityManager.instance.getPage<T>(this, options, stat)
  }
}
