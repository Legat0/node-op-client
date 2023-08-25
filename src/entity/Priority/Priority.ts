import Field from "../decorators/Field";
import BaseEntity from "../Abstract/BaseEntity";
import IPriorityBody from "./IPriorityBody";


export class Priority extends BaseEntity {
  public static url = "/api/v3/versions";

  @Field("name", String)
  public name: string;

  public body: IPriorityBody
}
