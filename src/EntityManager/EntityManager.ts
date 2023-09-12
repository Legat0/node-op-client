import fetch from 'cross-fetch'
import { type EntityCollectionElement } from '../entity/Abstract/BaseEntityAny'
import type BaseEntityAny from '../entity/Abstract/BaseEntityAny'
import type BaseEntity from '../entity/Abstract/BaseEntity'
import { type IEndpoint } from '../entity/Abstract/IEndpoint'
import ClientOAuth2, { type Options, type Token } from 'client-oauth2'
import WP from '../entity/WP/WP'
import EventEmitter from 'events'
import { type EntityFilterItem } from '../contracts/EntityFilterItem'
import { type FilterOperatorType } from '../contracts/FilterOperatorEnum'
import { Sema } from 'async-sema'

interface IFetchInit extends Omit<RequestInit, 'body'> {
  headers?: Record<string, string>
  body?: BodyInit | object
}

function base64Encode (s: string): string {
  return typeof window !== 'undefined'
    ? window.btoa(s)
    : Buffer.from(s).toString('base64')
}

function getApiKeyFromLocalStorage (): string | null {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('OP_API_KEY')
  }
  return ''
}

export enum AuthTypeEnum {
  OAUTH = 'OAUTH',
  APIKEY = 'APIKEY',
}
export interface EntityManagerConfig {
  baseUrl: string
  authType: AuthTypeEnum
  apiKeyOptions?: {
    getApiKey: () => string | undefined | null
  }
  oauthOptions?: Options & {
    oauthToken?: Token
  }
  /** default pageSize for getAll */
  pageSize?: number
  /** default count threads for getAll. For Chrome max count = 6  */
  threads?: number
}

export interface FetchRequest extends RequestInit {
  url: string
}

export interface ICollectionStat {
  total: number
  pageSize: number
  offset: number
}
export class CollectionStat implements ICollectionStat {
  public total: number
  public pageSize: number
  public offset: number
  constructor () {
    this.total = 0
    this.pageSize = 0
    this.offset = 0
  }
}

export interface GetAllOptions {
  notify?: boolean
  filters?: EntityFilterItem[]
  sortBy?: Map<string, 'asc' | 'desc'>
  groupBy?: string
  showSums?: boolean
  select?: string[]
  url?: string
  /** limit */
  pageSize?: number
  threads?: number
}
export interface GetManyOptions extends GetAllOptions {
  /** page */
  offset?: number
}

export class EntityManager {
  private OAuth: any
  private config: EntityManagerConfig
  private readonly emitter: EventEmitter
  oauthToken?: Token

  public static instance: EntityManager

  constructor (config?: Partial<EntityManagerConfig>) {
    this.emitter = new EventEmitter()
    this.useConfig(config)
  }

  public useConfig (config?: Partial<EntityManagerConfig>): this {
    this.config = {
      baseUrl: 'http://localhost',
      authType: AuthTypeEnum.APIKEY,
      pageSize: 20,
      ...config,
      apiKeyOptions: {
        getApiKey: getApiKeyFromLocalStorage,
        ...config?.apiKeyOptions
      }
    }
    this.config.oauthOptions = {
      accessTokenUri: `${this.config.baseUrl}/oauth/token`,
      ...config?.oauthOptions
    }

    const fullOauthOptions: Options = this.config?.oauthOptions
    if (fullOauthOptions.clientSecret == null) {
      fullOauthOptions.authorizationUri = `${this.config.baseUrl}/oauth/authorize`
    }
    this.OAuth = new ClientOAuth2(fullOauthOptions)

    this.oauthToken = this.config?.oauthOptions?.oauthToken
    return this
  }

  public onBeforeRequest (listener: (req: FetchRequest) => void): void {
    this.emitter.addListener(this.onBeforeRequest.name, listener)
  }

  public makeUrl (path: string | URL, params?: Record<string, any>): URL {
    const REMOVE_PARAMS = ['url']
    const url = new URL(path, this.config.baseUrl)

    if (params != null) {
      Object.entries(params).filter(([key, value]) => !REMOVE_PARAMS.includes(key))
        .map(([key, value]) => {
          if (value instanceof Map) {
            return [key, JSON.stringify([...value])]
          } else if (!['string', 'number'].includes(typeof value)) {
            return [key, JSON.stringify(value)]
          }

          return [key, value]
        }).forEach(([key, value]) => {
          url.searchParams.append(key, value)
        })
    }
    return url
  }

  async fetch (url: string | URL, options?: IFetchInit): Promise<any> {
    const requestInit = {
      headers: {},
      ...options,
      body: options?.body != null ? JSON.stringify(options.body) : null
    }

    if (requestInit.method != null && requestInit.method !== '' && requestInit.method.toUpperCase() !== 'GET') {
      requestInit.headers['Content-Type'] = 'application/json'
    }

    // собираем url
    url = this.makeUrl(url)

    if (this.config.authType === 'OAUTH') {
      // получаем токен из ОП
      if (this.oauthToken == null || this.oauthToken.expired()) {
        // authorization code flow
        if (
          this.OAuth.options.authorizationUri != null &&
          this.OAuth.options.redirectUri != null
        ) {
          if (window.location.href.match(/code/) == null) {
            // let uri = await
            window.location.href = this.OAuth.code.getUri()
          } else {
            this.oauthToken = await this.OAuth.code.getToken(
              window.location.search
            )
            if (this.oauthToken != null) {
              localStorage.setItem(
                'OP_OAUTH_ACCESS_TOKEN',
                this.oauthToken.accessToken
              )
              localStorage.setItem(
                'OP_OAUTH_REFRESH_TOKEN',
                this.oauthToken.refreshToken
              )
            }

            // const url = new URL (window.location.href)
            // url.searchParams.delete('code');
            // history.pushState(null, null, url.href)
          }
        } else {
          // credential flow
          this.oauthToken = await this.OAuth.credentials.getToken()
        }
      }

      // подписываем опции запроса заголовком Authorization
      const signedOptions = this.oauthToken?.sign({
        url,
        ...requestInit
      } as any)
      requestInit.headers = signedOptions.headers
    } else {
      const apikey = this.config.apiKeyOptions?.getApiKey()
      requestInit.headers.Authorization =
        'Basic ' + base64Encode('apikey:' + apikey)
    }

    this.emitter.emit(this.onBeforeRequest.name, {
      url,
      ...requestInit
    })
    // выполняем запрос
    const response = await fetch(url, requestInit)
    // let resultAsText = await response.text();
    // if (!response.ok) throw new Error(response.statusText)

    let result = null
    // парсим ответ

    if (response.status === 204) return null

    try {
      result = await response.json()
    } catch (err) {
      try {
        const resonseText = await response.text()
        throw new Error(resonseText)
      } catch {}
    }

    if (result._type === 'Error') {
      let message = `${response.status} [${result.errorIdentifier}] ${result.message}`
      if (result?._embedded?.errors?.length > 0) {
        message +=
            ' ' +
            Object.values(result._embedded.errors)
              .map(
                (eachError: any) =>
                  eachError._embedded.details.attribute +
                  ': ' +
                  eachError.message
              )
              .join(' ')
      }
      const error = new Error(message)
      throw error
    } else if (!response.ok) {
      throw new Error(response.statusText)
    }

    return result
  }

  async get<T extends BaseEntityAny>(
    Type: any,
    id: number | string | bigint | IEndpoint,
    params?: Record<string, any>
  ): Promise<T> {
    const entity = new Type(id)
    return await this.refresh(entity, params)
  }

  async refresh<T extends BaseEntity>(entity: T, params?: Record<string, any>): Promise<T> {
    const url = this.makeUrl(entity.self.href ?? '', params)
    const body = await this.fetch(url)
    entity.fill(body)
    entity._links = {}
    return entity
  }

  async getPage<T extends BaseEntityAny>(
    Type: any,
    options: GetManyOptions = {},
    stat?: ICollectionStat,
    sema?: Sema
  ): Promise<Array<EntityCollectionElement<T>>> {
    const elements: Array<EntityCollectionElement<T>> = []
    const url = this.makeUrl(options.url ?? Type.url, options)
    await sema?.acquire()
    try {
      const fetchResult = await this.fetch(url)
      elements.push(
        ...fetchResult._embedded.elements.map(
          (eachElement: any) => new Type(eachElement)
        )
      )

      if (stat != null) {
        stat.total = fetchResult.total
        stat.pageSize = fetchResult.pageSize
        stat.offset = fetchResult.offset
      }
    } finally {
      sema?.release()
    }

    return elements
  }

  /** alias getPage */
  async getMany<T extends BaseEntityAny>(
    Type: any,
    options: GetManyOptions = {},
    stat?: ICollectionStat
  ): Promise<Array<EntityCollectionElement<T>>> {
    return await this.getPage(Type, options, stat)
  }
  // async getMany<T extends BaseEntityAny>(
  //   T: any,
  //   options: GetManyOptions = {},
  //   stat?: CollectionStat
  // ): Promise<EntityCollectionElement<T>[]> {
  //   const result: EntityCollectionElement<T>[] = [];
  //   let total;
  //   let pageSize;
  //   for (
  //     let startOffset = options.offset || 1, offset = startOffset;
  //     offset === startOffset || (options.all && result.length < total); // TODO parallel requests for getAll ?
  //     offset++
  //   ) {
  //     const query = Object.entries({ ...options, offset })
  //       .map(([key, value]) => {
  //         if (key === "filters") {
  //           value = JSON.stringify(value);
  //         } else if (key === "sortBy" && value !== undefined) {
  //           value = JSON.stringify([
  //             ...(value as NonNullable<GetAllOptions["sortBy"]>),
  //           ]);
  //         }
  //         return key + "=" + value;
  //       })
  //       .join("&");
  //     const fetchResult = await this.fetch(`${options.url || T.url}?${query}`);
  //     result.push(
  //       ...fetchResult._embedded.elements.map(
  //         (eachElement: any) => new T(eachElement)
  //       )
  //     );
  //     total = fetchResult.total;
  //     pageSize = fetchResult.pageSize;
  //   }
  //   if (stat) {
  //     stat.total = total;
  //     stat.pageSize = pageSize;
  //   }

  //   return result;
  // }

  public createSema (threads?: number): Sema {
    return new Sema(
      threads ?? this.config.threads ?? 1, // Allow N concurrent async calls
      {
        capacity: 100 // Prealloc space for M tokens
      }
    )
  }

  async getAll<T extends BaseEntityAny>(
    Type: any,
    options: GetAllOptions = {}
  ): Promise<Array<EntityCollectionElement<T>>> {
    let elements: Array<EntityCollectionElement<T>> = []
    const pageSize = options.pageSize ?? this.config.pageSize
    const stat = new CollectionStat()
    const firstPageElements = await this.getPage<T>(
      Type,
      {
        ...options,
        pageSize,
        offset: 1
      },
      stat
    )

    elements = elements.concat(firstPageElements)

    if (firstPageElements.length < stat.total) {
      const sema = this.createSema(options.threads)

      const pageCount = Math.ceil(stat.total / stat.pageSize)
      const pages = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, i) => i + 2).map(async (offset) => {
          return await this.getPage<T>(
            Type,
            {
              ...options,
              pageSize: stat.pageSize,
              offset
            },
            undefined,
            sema
          )
        }

        )
      )

      pages.forEach((page) => {
        elements = elements.concat(page)
      })
    }

    return elements
    // return await this.getMany<T>(T, {
    //   pageSize: this.config.pageSize,
    //   ...options,
    //   all: true,
    // });
  }

  async patch<T extends BaseEntity>(
    entity: T,
    fieldPaths?: Array<keyof T['body'] | string>,
    notify?: boolean
  ): Promise<T> {
    const isWP = entity instanceof WP
    const patch = JSON.parse(
      JSON.stringify(
        (fieldPaths != null)
          ? entity.bodyScope(isWP ? [...fieldPaths, 'lockVersion'] : fieldPaths)
          : entity.body
      )
    )
    delete patch.createdAt
    delete patch.updatedAt
    if (entity instanceof WP) {
      if (patch.lockVersion === undefined || patch.lockVersion === null) {
        const actualCopy = await this.get<WP>(entity.constructor, entity.id)
        patch.lockVersion = actualCopy.body.lockVersion
      }
    }

    const url = new URL(entity.self.href ?? '', this.config.baseUrl)
    if (notify !== undefined) { url.searchParams.append('notify', JSON.stringify(notify)) }

    const patchedBody = await this.fetch(url, {
      method: 'PATCH',
      body: patch
    })
    if ((fieldPaths == null) || fieldPaths.length === 0) {
      entity.body = patchedBody
    } else {
      if (entity instanceof WP) { entity.body.lockVersion = patchedBody.lockVersion }

      entity.body.updatedAt = patchedBody.updatedAt;

      // updating embedded
      ((fieldPaths as string[]) ?? [])
        .filter((fieldPath) => fieldPath.startsWith('_links.'))
        .map((fieldPaths) => fieldPaths.substr(7))
        .forEach(
          (fieldName) =>
            (entity.body._embedded = Object.assign(
              entity.body._embedded ?? {},
              { [fieldName]: patchedBody._embedded[fieldName] }
            ))
        )
    }
    return entity
  }

  async create<T extends BaseEntity>(
    entity: T,
    options?: { url?: string, notify?: boolean }
  ): Promise<T> {
    const url = new URL(options?.url ?? entity.constructor.url, this.config.baseUrl)
    if (options?.notify !== undefined) { url.searchParams.append('notify', JSON.stringify(options?.notify)) }

    const { id, ...body } = entity.body
    const createdBody = await this.fetch(url, {
      method: 'POST',
      body
    })
    entity.body = createdBody
    return entity
  }

  async delete<T extends BaseEntity>(
    entity: T
  ): Promise<void> {
    if (entity.id > 0) {
      const url = new URL(entity.self.href ?? '', this.config.baseUrl)

      await this.fetch(url, {
        method: 'DELETE'
      })
    }
  }

  public async first<T extends BaseEntity>(
    Type: any,
    filters?: EntityFilterItem[]
  ): Promise<EntityCollectionElement<T> | null> {
    const result = await this.getMany<T>(Type, {
      pageSize: 1,
      filters
    })

    return result.length > 0 ? result[0] : null
  }

  public async findOrFail<T extends BaseEntityAny>(
    Type: any,
    id: number | string | bigint | IEndpoint,
    params?: Record<string, any>
  ): Promise<T> {
    return await this.get(Type, id, params)
  }

  public async findBy<T extends BaseEntity>(
    Type: any,
    key: keyof T['body'] | string,
    value: any
  ): Promise<EntityCollectionElement<T> | null> {
    // filter[UserExtend.fieldExternalId()] = { operator: '=', values: [id] }
    const filter = {
      [key]: { operator: '=' as FilterOperatorType, values: [value] }
    }
    return await this.first<T>(Type, [filter])
  }

  /**
   * validate data
   */
  async validate<T extends WP>(entity: T): Promise<T> {
    const url = entity.id > 0
      ? entity.constructor.url + `/${entity.id}/form`
      : entity.constructor.url + '/form'
    const form = await this.fetch(url, {
      method: 'POST',
      body: entity.body
    })
    const result = form._embedded.validationErrors
    console.log(result)
    return result
  }
}

export function jsonLogRequestToConsole (request: FetchRequest): void {
  console.debug(
    JSON.stringify({
      level: 'DEBUG',
      message: EntityManager.name + '.onBeforeRequest',
      request
    })
  )
}

const entityManager = new EntityManager()

entityManager.onBeforeRequest(jsonLogRequestToConsole)

EntityManager.instance = entityManager

export default entityManager
