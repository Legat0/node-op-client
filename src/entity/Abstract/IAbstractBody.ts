import { type IEndpoint } from './IEndpoint'

export interface ISchemaBody extends Record<string, any> {
  _type?: string
  _links: {
    self: IEndpoint
  } & Record<string, any>
}

export default interface IAbstractBody<IdType extends number | string = number>
  extends ISchemaBody {
  id: IdType
  _embedded?: Record<string, any>
}

export interface WithTimestamps {
  createdAt: string
  updatedAt: string
}

export interface WithCustomFields extends Record<`customField${number}`, any> {}
