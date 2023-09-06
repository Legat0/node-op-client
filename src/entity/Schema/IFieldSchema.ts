import { type IEndpoint } from '../Abstract/IEndpoint'

export enum FieldTypeEnum {
  Integer = 'Integer',
  // Integer = 'Integer'
}

type FieldTypes =
  | 'Integer'
  | '[1]Integer'
  | '[1]Float'
  | 'String'
  | '[1]String'
  | 'DateTime'
  | '[1]DateTime'
  | 'User'
  | 'Project'
  | 'Boolean'
  | '[1]Boolean'
  | 'QueryTimelineLabels'
  | 'QueryOrder'
  | 'QueryFilter'
  | 'QueryOperator'
  | 'WorkPackageCollection'
  | '[]User'
  | '[]WorkPackage'
  | '[]Priority'
  | '[]Role'
  | '[]Type'
  | '[]Version'
  | '[]Status'
  | '[]Project'
  | '[]QueryFilterInstance'
  | '[]QuerySortBy'
  | '[]CustomOption'
  | '[]QueryGroupBy'
  | '[]QueryColumn'
  | '[1]BacklogsType'
  | '[1]DateTime'

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
