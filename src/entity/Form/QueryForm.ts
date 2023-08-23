import BaseEntity from "../Abstract/BaseEntity";
import IQueryFormBody from "./IQueryFormBody";


export default class QueryForm extends BaseEntity {
  public static url: string = '/api/v3/queries/form'

  body: IQueryFormBody
}
