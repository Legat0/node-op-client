export interface IEndpoint {
  href: string | null,
  method?: "GET" | "POST" | "PATCH" | "DELETE",
  title?: string,
  type?: string,
  templated?: boolean,
}

export  class NullLink implements IEndpoint {
  public href = null
}
