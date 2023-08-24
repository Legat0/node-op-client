import Field from "../decorators/Field";
import { IPartialAbstractBody, LinkEntity } from "../Abstract/BaseEntityAny";
import BaseEntity from "../Abstract/BaseEntity";
import IProjectBody from "./IProjectBody";
import Link from "../decorators/Link";
import QueryFilterInstanceSchema from "../Query/QueryFilterInstanceSchema";

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

  filterInstanceSchemas() {
    return QueryFilterInstanceSchema.getAll({
      url:  `${this.self.href}/queries/filter_instance_schemas`,
    });
  }

  body: IProjectBody;
}
