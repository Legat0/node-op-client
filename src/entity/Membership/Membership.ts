import BaseEntity from "../Abstract/BaseEntity";
import Field from "../decorators/Field";
import Link from "../decorators/Link";
import Embedded from "../decorators/Embedded";
import Project from "../Project/Project";
import User from "../User/User";
import { Role } from "../Role/Role";
import IMembershipBody from "./IMembershipBody";

export default class Membership extends BaseEntity {
  public static url: string = '/api/v3/memberships'

  @Field('createdAt', Date)
  public createdAt: Date

  @Link('project', Project)
  public project: Project

  @Embedded('project', Project)
  public embeddedProject: Project

  @Link('principal', User)
  public principal: User // TODO User or UserGroup

  // @Link('roles', Role)
  // public roles: Role[] // TODO User or UserGroup

  public set roles(value: Role[]) {
    this.body._links['roles'] = value.map((v) => v.self)
  }

  public get roles(): Role[] {
    if (this.body._links.hasOwnProperty('roles')) {
      const linkSelf = this.body._links['roles']
      return linkSelf?.map((x) => new Role(x)) || []
    } else {
      return []
    }
  }

  public body: IMembershipBody

  public toString(): string {
    return `${this.id} ${this.self.title}`
  }
}
