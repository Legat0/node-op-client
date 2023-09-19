import Field from '../decorators/Field'
import BaseEntity from '../Abstract/BaseEntity'
import type INotificationBody from './INotificationBody'
import Link from '../decorators/Link'
import Project from '../Project/Project'
import User from '../User/User'
import { Activity } from '../Activity/Activity'
import WP from '../WP/WP'
import { LinkEntity } from '../Abstract/BaseEntityAny'
import EntityRequestBuilder from '../Abstract/EntityRequestBuilder'
import { type GetManyOptions } from '../../EntityManager/EntityManager'

export class NotificationRequestBuilder<
  T extends BaseEntity = Notification
> extends EntityRequestBuilder<T> {
  public whereProject (projectId: number): this {
    return this.addFilter('project', '=', [projectId])
  }

  public whereReason (reason: string): this {
    return this.addFilter('reason', '=', [reason])
  }

  public whereResource (resource: BaseEntity): this {
    return this.addFilter('resourceType', '=', [
      resource.body._type ?? ''
    ]).addFilter('resourceId', '=', [resource.id])
  }

  public whereReadIAN (readIAN: boolean): this {
    return this.addFilterBool('readIAN', readIAN)
  }

  public isUnread (): this {
    return this.whereReadIAN(false)
  }

  public isRead (): this {
    return this.whereReadIAN(true)
  }

  public async readAll (): Promise<void> {
    const url = this.getService().makeUrl(`${Notification.url}/read_ian`, { filters: this.filters })
    await this.getService().fetch(url, {
      method: 'POST',
      signal: this.signal
    })
  }

  public async unreadAll (): Promise<void> {
    const url = this.getService().makeUrl(`${Notification.url}/unread_ian`, { filters: this.filters })
    await this.getService().fetch(url, {
      method: 'POST',
      signal: this.signal
    })
  }
}

export default class Notification extends BaseEntity {
  public static url = '/api/v3/notifications'

  public body: INotificationBody

  @Field()
  public readIAN: boolean

  @Field()
  public reason: string

  @Field()
  public subject?: string

  @Field('createdAt', Date)
    createdAt: Date

  @Field('updatedAt', Date)
    updatedAt: Date

  @Link('project', Project)
    project: LinkEntity<Project>

  /** The user that caused the notification */
  @Link('actor', User)
    actor?: LinkEntity<User>

  /** The journal the notification belongs to */
  @Link('activity', Activity)
    activity?: LinkEntity<Activity>

  /** The resource the notification belongs to. Polymorphic = WP | ? */
  @Link('resource', WP) // TODO work with Polymorphic
    resource?: LinkEntity<WP>

  // TODO work with Polymorphic
  /** A list of objects including detailed information */
  // @EmbeddedArray('details', BaseEntityAny )
  //   details: BaseEntityAny[]

  public static request<T extends BaseEntity>(
    this: new () => T,
    options?: GetManyOptions
  ): NotificationRequestBuilder<T> {
    return new NotificationRequestBuilder<T>(this, options, undefined)
  }

  /** Marks the notification as read */
  public async read (): Promise<void> {
    await this.getService().fetch(this.makeUrl('read_ian'), {
      method: 'POST'
    })

    this.readIAN = true
  }

  /** Marks the given notification as unread. */
  public async unread (): Promise<void> {
    await this.getService().fetch(this.makeUrl('unread_ian'), {
      method: 'POST'
    })

    this.readIAN = false
  }
}
