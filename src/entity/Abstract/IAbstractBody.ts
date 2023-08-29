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
  createdAt?: string
  updatedAt?: string
  _embedded?: Record<string, any>
}
