import BaseEntity from "../Abstract/BaseEntity";
import Field from "../decorators/Field";
import IVersionBody from "./IVersionBody";
import Project from "entity/Project/Project";
import Link from "entity/decorators/Link";
import Embedded from "entity/decorators/Embedded";

export enum VersionStatusEnum {
  open = "open",
  locked = "locked",
  closed = "closed",
}

export class Version extends BaseEntity {
  public static url = "/api/v3/versions";

  @Field("startDate", Date)
  public startDate?: Date | null;

  @Field("endDate", Date)
  public endDate?: Date | null;

  @Link("definingProject", Project)
  public definingProject: Project;

  @Embedded("definingProject", Project)
  public embeddedProject: Project;

  @Field("name", String)
  public name: string;

  @Field("status", String)
  public status?: VersionStatusEnum;

  public body: IVersionBody;

}
