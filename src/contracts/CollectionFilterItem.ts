import { FilterOperatorType } from "./FilterOperatorEnum";

export interface CollectionFilterItem  {
  [field: string]: {operator: FilterOperatorType, values: any[] | any }
}
