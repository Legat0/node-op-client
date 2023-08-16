import IStatusBody from "./IStatusBody";
import BaseEntity from "../Abstract/BaseEntity";
import Field from "../decorators/Field";

export default class Status extends BaseEntity {
  ['constructor']: typeof Status

  static url = '/api/v3/statuses'

  body: IStatusBody

  @Field('isClosed', Boolean)
  isClosed:boolean
}
