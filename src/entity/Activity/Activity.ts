import HtmlFieldValue from "../../contracts/HtmlFieldValue";
import Field from "../../entity/decorators/Field";
import Link from "../../entity/decorators/Link";
import User from "../../entity/User/User";
import BaseEntity from "../Abstract/BaseEntity";
import IActivityBody from "./IActivityBody";

export class Activity extends BaseEntity {
  public static url = "/api/v3/activities";

  public body: IActivityBody;

  @Field("comment", Object)
  public comment: HtmlFieldValue | string;

  @Field("createdAt", Date)
  public createdAt: Date;

  @Field("updatedAt", Date)
  public updatedAt: Date;

  @Link("user", User)
  public user: User;
}
