import Field from '../decorators/Field'
import Link from '../decorators/Link'
import BaseEntity from '../Abstract/BaseEntity'
import type IQueryBody from './IQueryBody'
import QueryForm from './QueryForm'
import Project from '../Project/Project'
import { LinkEntity } from '../Abstract/BaseEntityAny'
import User from '../User/User'
import { DisplayRepresentationEnum, HighlightingModeEnum, TimelineZoomLevelEnum, type QueryFilterInstance } from './IQueryBody'
import Embedded from '../decorators/Embedded'
import WorkPackageCollection from '../WP/WorkPackageCollection'

// export

export default class Query extends BaseEntity {
  public static url: string = '/api/v3/queries'

  @Field('name', String)
    name: string

  @Field('starred', Boolean)
  readonly starred: boolean

  @Field('sums', Boolean)
    sums: boolean

  @Field('createdAt', Date)
    createdAt: Date

  @Field('updatedAt', Date)
    updatedAt: Date

  @Link('project', Project)
    project?: LinkEntity<Project>

  @Link('user', User)
    user: LinkEntity<User>

  @Field('user', Array)
    filters: QueryFilterInstance[]

  @Field('timelineVisible', Boolean)
    timelineVisible: boolean

  @Field('timelineLabels', Object)
    timelineLabels: object

  @Field('timelineZoomLevel', String)
    timelineZoomLevel: TimelineZoomLevelEnum

  @Field('highlightingMode', String)
    highlightingMode: HighlightingModeEnum

  @Field('showHierarchies', Boolean)
    showHierarchies: boolean

  @Field('public', Boolean)
    public: boolean

  @Field('displayRepresentation', String)
    displayRepresentation: DisplayRepresentationEnum

  @Embedded('results', WorkPackageCollection)
    results: WorkPackageCollection

  body: IQueryBody

  static async form (query?: Query): Promise<QueryForm> {
    const result = await QueryForm.getService().fetch(QueryForm.url, {
      method: 'POST',
      body: query?.body
    })

    return new QueryForm(result)
  }

  public async form (): Promise<QueryForm> {
    const body = await this.getService().fetch(this.id > 0 ? this.self.href + '/form' : QueryForm.url, {
      method: 'POST',
      body: this.body
    })

    return new QueryForm(body)
  }
}
