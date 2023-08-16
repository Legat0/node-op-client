
import Field from "entity/decorators/Field";
import BaseEntity from "../Abstract/BaseEntity";
import IRoleBody from "./IRoleBody";

export class Role extends BaseEntity {
  public static url = "/api/v3/roles";

  @Field("name", String)
  public name: string;

  public body: IRoleBody;
}
