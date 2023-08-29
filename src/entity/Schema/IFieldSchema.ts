import { type IEndpoint } from '../Abstract/IEndpoint'

export enum FieldTypeEnum {
  Integer = 'Integer',
  // Integer = 'Integer'
}

type FieldTypes =
  | 'Integer'
  | 'String'
  | 'DateTime'
  | 'User'
  | 'Project'
  | 'Boolean'
  | 'QueryTimelineLabels'
  | 'QueryOrder'
  | 'QueryFilter'
  | 'QueryOperator'
  | 'WorkPackageCollection'
  | '[]User'
  | '[]Status'
  | '[]Project'
  | '[]QueryFilterInstance'
  | '[]QuerySortBy'
  | '[]CustomOption'
  | '[]QueryGroupBy'
  | '[]QueryColumn'

export default interface IFieldSchema<T extends FieldTypes, AllowedValuesType = any> {
  type: T
  name: string
  required: boolean
  hasDefault: boolean
  writable: boolean
  options: object
  location?: '_links' | string
  _embedded?: {
    allowedValues?: AllowedValuesType[]
  }
  _links?: {
    allowedValues?: IEndpoint | IEndpoint[]
  }
}

// interface IntegerFieldSchema extends IFieldSchema {
//   type: 'Integer'
// }

// type ISchemaBodyFields =   { [k: string]: IFieldSchema } //& { [K in `_${string}`]?: never }
