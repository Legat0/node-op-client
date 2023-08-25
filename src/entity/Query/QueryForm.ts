
import BaseEntityAny from "../Abstract/BaseEntityAny";
import IQueryFormBody from "./IQueryFormBody";
import QueryFilter from "./QueryFilter";
import QueryFilterInstanceSchema from "./QueryFilterInstanceSchema";

export default class QueryForm extends BaseEntityAny<""> {
  public static url: string = "/api/v3/queries/form";

  body: IQueryFormBody;

  /**
   * Return all available filter resources.
   * They need to be instantiated before using them in this service.
   */
  public get availableFilters(): QueryFilter[] {
    return this.filtersSchemas
      .map((schema) => schema.allowedFilterValue)
      .filter((x): x is QueryFilter => !!x);
  }

  public get visibleFilters(): QueryFilter[] {
    return this.availableFilters.filter((x) => x.isVisible);
  }

  get filtersSchemas(): QueryFilterInstanceSchema[] {
    return this.body._embedded.schema._embedded.filtersSchemas._embedded.elements.map(
      (x) => new QueryFilterInstanceSchema(x)
    );
  }

  get visibleFilterSchemas(): QueryFilterInstanceSchema[] {
    return this.filtersSchemas.filter((x) => x.allowedFilterValue?.isVisible);
  }
}
