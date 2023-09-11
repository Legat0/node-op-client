import { type FilterOperatorType } from './FilterOperatorEnum'

export interface EntityFieldFilter {
  operator: FilterOperatorType
  values?: null | string | number | Array<string | number>
}

export type EntityFilterItem = Record<string, EntityFieldFilter>
