import BaseEntity from "../Abstract/BaseEntity";
import ITypeBody from "./ITypeBody";

export default class Type extends BaseEntity {
  // ['constructor']: typeof Type

  static url = '/api/v3/types'

  body: ITypeBody
}
