import fetch from "cross-fetch";
import BaseEntityAny, {
  EntityCollectionElement,
} from "../entity/Abstract/BaseEntityAny";
import BaseEntity from "../entity/Abstract/BaseEntity";
import { IEndpoint } from "../entity/Abstract/IEndpoint";
import ClientOAuth2, { Options, Token } from "client-oauth2";
import WP from "../entity/WP/WP";
import EventEmitter from "events";
import { EntityFilterItem } from "../contracts/EntityFilterItem";
import { FilterOperatorType } from "../contracts/FilterOperatorEnum";

interface IFetchInit extends Omit<RequestInit, "body"> {
  headers?: Record<string, string>;
  body?: BodyInit | object;
}

function base64Encode(s: string): string {
  return typeof window !== "undefined"
    ? window.btoa(s)
    : Buffer.from(s).toString("base64");
}

function getApiKeyFromLocalStorage(): string | null {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem("OP_API_KEY");
  }
  return "";
}

export enum AuthTypeEnum {
  OAUTH = "OAUTH",
  APIKEY = "APIKEY",
}
export interface EntityManagerConfig {
  baseUrl: string;
  authType: AuthTypeEnum;
  apiKeyOptions?: {
    getApiKey: () => string | undefined | null;
  };
  oauthOptions?: Options & {
    oauthToken?: Token;
  };
  /** default pageSize for getAll */
  pageSize?: number;
}

export interface FetchRequest extends RequestInit {
  url: string;
}

export interface GetAllOptions {
  notify?: boolean;
  filters?: EntityFilterItem[];
  sortBy?: Map<string, "asc" | "desc">;
  groupBy?: string;
  showSums?: boolean;
  select?: string[];
  url?: string;
  /** limit */
  pageSize?: number;
}
export interface GetManyOptions extends GetAllOptions {
  all?: boolean;
  /** page */
  offset?: number;
}

export class EntityManager {
  private OAuth: any;
  private config: EntityManagerConfig;
  private emitter: EventEmitter;
  oauthToken?: Token;

  public static instance: EntityManager;

  constructor(config?: Partial<EntityManagerConfig>) {
    this.emitter = new EventEmitter();
    this.useConfig(config);
  }

  public useConfig(config?: Partial<EntityManagerConfig>): this {
    this.config = {
      baseUrl: "http://localhost",
      authType: AuthTypeEnum.APIKEY,
      pageSize: 100,
      ...config,
      apiKeyOptions: {
        getApiKey: getApiKeyFromLocalStorage,
        ...config?.apiKeyOptions,
      },
    };
    this.config.oauthOptions = {
      accessTokenUri: `${this.config.baseUrl}/oauth/token`,
      ...config?.oauthOptions,
    };

    const fullOauthOptions: Options = this.config?.oauthOptions;
    if (!fullOauthOptions.clientSecret) {
      fullOauthOptions.authorizationUri = `${this.config.baseUrl}/oauth/authorize`;
    }
    this.OAuth = new ClientOAuth2(fullOauthOptions);

    this.oauthToken = this.config?.oauthOptions?.oauthToken;
    return this;
  }

  public onBeforeRequest(listener: (req: FetchRequest) => void) {
    this.emitter.addListener(this.onBeforeRequest.name, listener);
  }

  public makeUrl(path: string | URL): string {
    return (
      this.config.baseUrl + (path.toString().startsWith("/") ? "" : "/") + path
    );
  }

  async fetch(url: string | URL, options?: IFetchInit) {
    const requestInit = {
      headers: {},
      ...options,
      body: options?.body ? JSON.stringify(options.body) : null,
    };

    if (requestInit.method && requestInit.method.toUpperCase() !== "GET") {
      requestInit.headers["Content-Type"] = "application/json";
    }

    // собираем url
    url = this.makeUrl(url);

    if (this.config.authType === "OAUTH") {
      // получаем токен из ОП
      if (!this.oauthToken || this.oauthToken.expired()) {
        // authorization code flow
        if (
          this.OAuth.options.authorizationUri &&
          this.OAuth.options.redirectUri
        ) {
          if (!window.location.href.match(/code/)) {
            // let uri = await
            window.location.href = this.OAuth.code.getUri();
          } else {
            this.oauthToken = await this.OAuth.code.getToken(
              window.location.search
            );
            if (this.oauthToken) {
              localStorage.setItem(
                "OP_OAUTH_ACCESS_TOKEN",
                this.oauthToken.accessToken
              );
              localStorage.setItem(
                "OP_OAUTH_REFRESH_TOKEN",
                this.oauthToken.refreshToken
              );
            }

            // const url = new URL (window.location.href)
            // url.searchParams.delete('code');
            // history.pushState(null, null, url.href)
          }
        }
        // credential flow
        else {
          this.oauthToken = await this.OAuth.credentials.getToken();
        }
      }

      // подписываем опции запроса заголовком Authorization
      const signedOptions = this.oauthToken?.sign({
        url,
        ...requestInit,
      } as any);
      requestInit.headers = signedOptions.headers;
    } else {
      const apikey = this.config.apiKeyOptions?.getApiKey();
      requestInit.headers["Authorization"] =
        "Basic " + base64Encode("apikey:" + apikey);
    }

    // выполняем запрос
    const emit = this.emitter.emit(this.onBeforeRequest.name, {
      url,
      ...requestInit,
    });
    const response = await fetch(url, requestInit);
    // let resultAsText = await response.text();
    let result;
    // парсим ответ
    if (
      response.headers.get("content-type") ===
      "application/hal+json; charset=utf-8"
    ) {
      try {
        result = await response.json();
      } catch (err) {
        const resonseText = await response.text();
        throw new Error(resonseText);
      }
      if (result._type === `Error`) {
        let message = `${response.status} [${result.errorIdentifier}] ${result.message}`;
        if (result?._embedded?.errors?.length) {
          message +=
            " " +
            Object.values(result._embedded.errors)
              .map(
                (eachError: any) =>
                  eachError._embedded.details.attribute +
                  ": " +
                  eachError.message
              )
              .join(" ");
        }
        const error = new Error(message);
        throw error;
      }
    }
    return result;
  }

  async get<T extends BaseEntityAny>(
    T: any,
    id: number | string | bigint | IEndpoint
  ): Promise<T> {
    const result = new T(id);
    return this.refresh(result);
  }

  async refresh<T extends BaseEntity>(entity: T): Promise<T> {
    const body = await this.fetch(entity.self.href || "");
    entity.fill(body);
    entity._links = {};
    return entity;
  }

  async getMany<T extends BaseEntityAny>(
    T: any,
    options: GetManyOptions = {}
  ): Promise<EntityCollectionElement<T>[]> {
    const result: EntityCollectionElement<T>[] = [];
    let total;
    for (
      let startOffset = options.offset || 1, offset = startOffset;
      offset === startOffset || (options.all && result.length < total); // TODO parallel requests for getAll ?
      offset++
    ) {
      const query = Object.entries({ ...options, offset })
        .map(([key, value]) => {
          if (key === "filters") {
            value = JSON.stringify(value);
          } else if (key === "sortBy" && value !== undefined) {
            value = JSON.stringify([
              ...(value as NonNullable<GetAllOptions["sortBy"]>),
            ]);
          }
          return key + "=" + value;
        })
        .join("&");
      const fetchResult = await this.fetch(`${options.url || T.url}?${query}`);
      result.push(
        ...fetchResult._embedded.elements.map(
          (eachElement: any) => new T(eachElement)
        )
      );
      total = fetchResult.total;
    }
    return result;
  }

  async getAll<T extends BaseEntityAny>(
    T: any,
    options: GetAllOptions = {}
  ): Promise<Array<EntityCollectionElement<T>>> {
    return await this.getMany<T>(T, {
      pageSize: this.config.pageSize,
      ...options,
      all: true,
    });
  }

  async patch<T extends BaseEntity>(
    entity: T,
    fieldPaths?: Array<keyof T["body"] | string>,
    notify?: boolean
  ): Promise<T> {
    const isWP = entity instanceof WP;
    const patch = JSON.parse(
      JSON.stringify(
        fieldPaths
          ? entity.bodyScope(isWP ? [...fieldPaths, "lockVersion"] : fieldPaths)
          : entity.body
      )
    );
    delete patch.createdAt;
    delete patch.updatedAt;
    if (entity instanceof WP) {
      if (patch.lockVersion === undefined || patch.lockVersion === null) {
        const actualCopy = await this.get<WP>(entity.constructor, entity.id);
        patch.lockVersion = actualCopy.body.lockVersion;
      }
    }

    const url = new URL(entity.self.href || "");
    if (notify !== undefined)
      url.searchParams.append("notify", JSON.stringify(notify));

    const patchedBody = await this.fetch(url, {
      method: "PATCH",
      body: patch,
    });
    if (!fieldPaths || fieldPaths.length == 0) {
      entity.body = patchedBody;
    } else {
      if (entity instanceof WP)
        entity.body.lockVersion = patchedBody.lockVersion;

      entity.body["updatedAt"] = patchedBody.updatedAt;

      // updating embedded
      ((fieldPaths as string[]) || [])
        .filter((fieldPath) => fieldPath.startsWith("_links."))
        .map((fieldPaths) => fieldPaths.substr(7))
        .forEach(
          (fieldName) =>
            (entity.body._embedded = Object.assign(
              entity.body._embedded || {},
              { [fieldName]: patchedBody._embedded[fieldName] }
            ))
        );
    }
    return entity;
  }

  async create<T extends BaseEntity>(
    entity: T,
    options?: { url?: string; notify?: boolean }
  ): Promise<T> {
    const url = new URL(options?.url || entity.constructor.url);
    if (options?.notify !== undefined)
      url.searchParams.append("notify", JSON.stringify(options?.notify));

    const createdBody = await this.fetch(url, {
      method: "POST",
      body: entity.body,
    });
    entity.body = createdBody;
    return entity;
  }

  public async first<T extends BaseEntity>(
    T: any,
    filters?: EntityFilterItem[]
  ): Promise<EntityCollectionElement<T> | null> {
    const result = await this.getMany<T>(T, {
      pageSize: 1,
      filters,
    });

    return result.length > 0 ? result[0] : null;
  }

  public async findOrFail<T extends BaseEntityAny>(
    T: any,
    id: number | string | bigint | IEndpoint
  ): Promise<T> {
    return this.get(T, id);
  }

  public async findBy<T extends BaseEntity>(
    T: any,
    key: keyof T["body"] | string,
    value: any
  ): Promise<EntityCollectionElement<T> | null> {
    // filter[UserExtend.fieldExternalId()] = { operator: '=', values: [id] }
    const filter = {
      [key]: { operator: "=" as FilterOperatorType, values: [value] },
    };
    return await this.first<T>(T, [filter]);
  }

  /**
   * validate data
   */
  async validate<T extends WP>(entity: T): Promise<T> {
    const url = entity.id
      ? entity.constructor.url + `/${entity.id}/form`
      : entity.constructor.url + `/form`;
    const form = await this.fetch(url, {
      method: "POST",
      body: entity.body,
    });
    const result = form._embedded.validationErrors;
    console.log(result);
    return result;
  }
}

export function jsonLogRequestToConsole(request: FetchRequest) {
  console.debug(
    JSON.stringify({
      level: "DEBUG",
      message: EntityManager.name + ".onBeforeRequest",
      request,
    })
  );
}

var entityManager = new EntityManager();

entityManager.onBeforeRequest(jsonLogRequestToConsole);

EntityManager.instance = entityManager;

export default entityManager;
