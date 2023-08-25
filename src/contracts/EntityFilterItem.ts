import { FilterOperatorType } from "./FilterOperatorEnum";

export interface EntityFieldFilter {
  operator: FilterOperatorType;
  values?: any[] | any;
}

export interface EntityFilterItem {
  [field: string]: EntityFieldFilter;
}
