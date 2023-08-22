import Field from "../../entity/decorators/Field";
import BaseEntity from "../Abstract/BaseEntity";

/**
 * Custom option
 */
export default class CustomOption extends BaseEntity {
  ["constructor"]: typeof CustomOption;

  static url = "/api/v3/custom_options";

  @Field("value", String)
  value: string;
}

export class JsonCustomOption<T extends Object> extends CustomOption {
  get data() {
    return this.parseSelf<T>();
  } 
}
