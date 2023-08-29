import { type FilterOperatorType } from './FilterOperatorEnum'

export interface EntityFieldFilter {
  operator: FilterOperatorType
  values?: any[] | any
}

export type EntityFilterItem = Record<string, EntityFieldFilter>
