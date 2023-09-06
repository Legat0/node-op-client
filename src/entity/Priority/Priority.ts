import Field from '../decorators/Field'
import BaseEntity from '../Abstract/BaseEntity'
import type IPriorityBody from './IPriorityBody'

export default class Priority extends BaseEntity {
  public static url = '/api/v3/priorities'

  @Field()
  public name: string

  /** Sort index of the priority */
  @Field()
  public position: number

  @Field()
  public color: string

  @Field()
  public isDefault: boolean

  @Field()
  public isActive: boolean

  public body: IPriorityBody
}
