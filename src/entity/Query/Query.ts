import Field from '../decorators/Field'
import Link from '../decorators/Link'
import BaseEntity from '../Abstract/BaseEntity'
import type IQueryBody from './IQueryBody'
import QueryForm from './QueryForm'
import Project from '../Project/Project'
import { LinkEntity } from '../Abstract/BaseEntityAny'

// export

export default class Query extends BaseEntity {
  public static url: string = '/api/v3/queries'

  @Field('name', String)
    name: string

  @Link('project', Project)
    project?: LinkEntity<Project>

  body: IQueryBody

  static async form (query?: Query): Promise<QueryForm> {
    const result = await QueryForm.getService().fetch(QueryForm.url, {
      method: 'POST',
      body: query?.body
    })

    return new QueryForm(result)
  }
}
