import { type IEndpoint } from '../Abstract/IEndpoint'

export enum FieldTypeEnum {
  Integer = 'Integer',
  // Integer = 'Integer'
}

export type FilterFieldTypes =
'[1]Integer'
| '[1]Float'
| '[1]String'
| '[1]DateTime'
| '[]CustomOption'
| '[]User'
| '[1]Boolean'
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

export type CustomFieldTypes =
'String'
| 'Formattable'
| 'Integer'
| 'Float'
| 'Boolean'
| 'Date'
| 'User'
| '[]User'
| 'Version'
| '[]Version'
| 'CustomOption'
| '[]CustomOption'

export type EntityFieldTypes = CustomFieldTypes
| 'Integer'
| 'String'
| 'Formattable'
| 'DateTime'
| 'Date'
| 'Boolean'
| 'User'
| 'Project'
| 'Type'
| 'Version'
| 'Priority'
| 'WorkPackage'
| 'Duration'
| 'Status'
| 'Category'
| 'QueryTimelineLabels'
| 'QueryOrder'
| 'QueryFilter'
| 'QueryOperator'
| 'WorkPackageCollection'
| 'Collection'

export type FieldTypes = FilterFieldTypes | EntityFieldTypes

export default interface IFieldSchema<T extends FieldTypes, AllowedValuesType = any> {
  type: T
  name: string
  required: boolean
  hasDefault: boolean
  writable: boolean
  options: object
  location?: '_links' | '_embedded'
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
