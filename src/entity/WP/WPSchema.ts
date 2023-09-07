import { type ISchemaBody } from '../Abstract/IAbstractBody'
import type IFieldSchema from '../Schema/IFieldSchema'
import { type CustomFieldTypes, type EntityFieldTypes } from '../Schema/IFieldSchema'

export interface WorkPackageFormAttributeGroup {
  _type: 'WorkPackageFormAttributeGroup'
  name: string
  attributes: string[]
}

export interface EntityFieldSchema<T extends EntityFieldTypes, AllowedValuesType = any> extends IFieldSchema<T, AllowedValuesType> {}

export default interface WPSchema extends ISchemaBody {
  _type: 'Schema'
  _attributeGroups: WorkPackageFormAttributeGroup[]
  _dependencies: Array<Record<string, any>>
  id: EntityFieldSchema<'Integer'>
  subject: EntityFieldSchema<'String'>
  description: EntityFieldSchema<'Formattable'>
  duration: EntityFieldSchema<'Duration'>
  scheduleManually: EntityFieldSchema<'Boolean'>
  ignoreNonWorkingDays: EntityFieldSchema<'Boolean'>
  startDate: EntityFieldSchema<'Date'>
  dueDate: EntityFieldSchema<'Date'>
  derivedStartDate: EntityFieldSchema<'Date'>
  derivedDueDate: EntityFieldSchema<'Date'>
  estimatedTime: EntityFieldSchema<'Duration'>
  derivedEstimatedTime: EntityFieldSchema<'Duration'>
  spentTime: EntityFieldSchema<'Duration'>
  percentageDone: EntityFieldSchema<'Integer'>
  readonly: EntityFieldSchema<'Boolean'>
  createdAt: EntityFieldSchema<'DateTime'>
  updatedAt: EntityFieldSchema<'DateTime'>
  author: EntityFieldSchema<'User'>
  project: EntityFieldSchema<'Project'>
  parent: EntityFieldSchema<'WorkPackage'>
  assignee: EntityFieldSchema<'User'>
  responsible: EntityFieldSchema<'User'>
  type: EntityFieldSchema<'Type'>
  status: EntityFieldSchema<'Status'>
  category: EntityFieldSchema<'Category'>
  version: EntityFieldSchema<'Version'>
  priority: EntityFieldSchema<'Priority'>
  overallCosts: EntityFieldSchema<'String'>
  laborCosts: EntityFieldSchema<'String'>
  materialCosts: EntityFieldSchema<'String'>
  costsByType: EntityFieldSchema<'Collection'>
  remainingTime: EntityFieldSchema<'Duration'>
  [x: `customField${number}`]: EntityFieldSchema<CustomFieldTypes>

  _linsk: {
    self: {
      /** id = project_id - type_id */
      href: `/api/v3/work_packages/schemas/${number}-${number}`
    }
  }
}
