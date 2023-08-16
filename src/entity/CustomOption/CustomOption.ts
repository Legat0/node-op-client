import BaseEntity from "../Abstract/BaseEntity";
import ITypeBody from "../Type/ITypeBody";

/**
 * Custom option
 */
export default class CustomOption extends BaseEntity {
  ['constructor']: typeof CustomOption

  static url = '/api/v3/custom_options'
}
