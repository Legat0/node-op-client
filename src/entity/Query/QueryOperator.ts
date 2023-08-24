import Field from "../decorators/Field";
import BaseEntityAny from "../Abstract/BaseEntityAny";
import IAbstractBody from "../Abstract/IAbstractBody";

export interface QueryOperatorBody extends IAbstractBody<string> {
  _type?: "QueryOperator";
  /** example: ИЛИ, не, не пусто */
  name: string;
}

export default class QueryOperator extends BaseEntityAny<string> {
  static url = "/api/v3/queries/operators";

  @Field("name", String)
  name: string;

  body: QueryOperatorBody;
}
