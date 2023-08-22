import { IEndpoint } from "../Abstract/IEndpoint";
import IWPBody from "./IWPBody";
import BaseEntity, { IPartialAbstractBody, LinkEntity } from "../Abstract/BaseEntity";
import Status from "../Status/Status";
import Type from "../Type/Type";
import User from "../User/User";
import Link from "../decorators/Link";
import Project from "../Project/Project";
import CustomOption from "../CustomOption/CustomOption";
import Duration from "../Abstract/Duration";
import Field from "../decorators/Field";
import Embedded from "../decorators/Embedded";

export interface IPartialWPBody extends Partial<Omit<IWPBody, "_links">> {
  _links?: Partial<IWPBody["_links"]>;
}


/**
 * Work package
 */
export default class WP extends BaseEntity {
  // ['constructor']: typeof WP

  static url = "/api/v3/work_packages";

  constructor(init?: number | IEndpoint | IPartialAbstractBody) {
    super(init);
  }

  @Field("subject", String)
  subject: string;

  @Field("startDate", Date)
  startDate: Date;

  @Field("dueDate", Date)
  dueDate: Date;

  @Field("scheduleManually", Boolean)
  scheduleManually: boolean;

  @Field("createdAt", Date)
  createdAt: Date;

  @Field("estimatedTime", Duration)
  estimatedTime: Duration;
  @Field("spentTime", Duration)
  spentTime: Duration;

  @Field("derivedEstimatedTime", Duration)
  derivedEstimatedTime: Duration;

  @Link("project", Project)
  project: LinkEntity<Project>;
  @Embedded("project", Project)
  embeddedProject?: Project;

  @Link("status", Status)
  status: LinkEntity<Status>;
  @Embedded("status", Status)
  embeddedStatus?: Status;

  @Link("type", Type)
  type: LinkEntity<Type>;
  @Embedded("type", Type)
  embeddedType?: Type;

  @Link("assignee", User)
  assignee: LinkEntity<User> | null
  @Embedded("assignee", User)
  embeddedAssignee?: User | null;

  @Link("author", User)
  author: LinkEntity<User>;

  @Link("parent", WP)
  parent: LinkEntity<WP> | null;

  body: IWPBody;

  get ancestor(): WP | null | undefined {
    if (!this.body._links.ancestors) {
      return undefined;
    }
    if (this.body._links.ancestors.length) {
      return new WP(
        this.body._links.ancestors[this.body._links.ancestors.length - 1]
      );
    }
    return null;
  }

  get children(): WP[] | undefined{
    if (!this.body._links.children) {
      return undefined;
    }
    return this.body._links.children.map(
      (eachChildJson) => new WP(eachChildJson)
    );
  }

  toString() {
    return `${this.id} ${this.type.self.title}(${this.type.id}) ${this.self.title}`;
  }
}
