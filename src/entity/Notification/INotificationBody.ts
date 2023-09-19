import { type IEndpoint } from '../Abstract/IEndpoint'
import type IAbstractBody from '../Abstract/IAbstractBody'
import { type WithTimestamps } from '../Abstract/IAbstractBody'

export default interface INotificationBody extends IAbstractBody, WithTimestamps {
  _type?: 'Notification'
  subject?: string
  reason: string
  readIAN: boolean

  _links: IAbstractBody['_links'] & {
    project: IEndpoint
    /** The user that caused the notification */
    actor?: IEndpoint
    /** Polymorphic = WP | ? */
    resource: IEndpoint
    activity?: IEndpoint
    details?: IEndpoint
  }
}
