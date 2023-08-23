import Field from "../decorators/Field";
import BaseEntity, { IPartialAbstractBody, LinkEntity } from "../Abstract/BaseEntity";
import IProjectBody from "./IProjectBody";
import Link from "../decorators/Link";


export default class Project extends BaseEntity {
  // ['constructor']: typeof Project

  static url = "/api/v3/projects";

  @Field("name", String)
  name: string;

  @Field("active", Boolean)
  active: boolean;

  @Field("active", Boolean)
  public: boolean;

  @Field("createdAt", Date)
  createdAt: Date;

  @Field("updatedAt", Date)
  updatedAt: Date;

  @Field("status", String)
  status: string;

  @Link("parent", Project)
  parent: LinkEntity<Project> | null;

  body: IProjectBody;
}
