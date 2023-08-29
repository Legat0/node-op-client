import BaseEntity from '../Abstract/BaseEntity'
import Field from '../decorators/Field'
import Link from '../decorators/Link'
import Embedded from '../decorators/Embedded'
import Project from '../Project/Project'
import User from '../User/User'
import { Role } from '../Role/Role'
import type IMembershipBody from './IMembershipBody'
import LinkArray from '../decorators/LinkArray'
import { LinkEntity } from '../Abstract/BaseEntityAny'

export default class Membership extends BaseEntity {
  public static url: string = '/api/v3/memberships'

  @Field('createdAt', Date)
  public createdAt: Date

  @Link('project', Project)
  public project: LinkEntity<Project>

  @Embedded('project', Project)
  public embeddedProject: Project

  @Link('principal', User)
  public principal: LinkEntity<User> // TODO User or UserGroup

  @LinkArray('roles', Role)
  public roles: Array<LinkEntity<Role>>

  public body: IMembershipBody

  public toString (): string {
    return `${this.id} ${this.self.title}`
  }
}
