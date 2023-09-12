import Field from '../decorators/Field'
import { type EntityCollectionElement, type LinkEntity } from '../Abstract/BaseEntityAny'
import BaseEntity from '../Abstract/BaseEntity'
import type IProjectBody from './IProjectBody'
import Link from '../decorators/Link'
import QueryFilterInstanceSchema from '../Query/QueryFilterInstanceSchema'
import type WP from '../WP/WP'
import EntityRequestBuilder from '../Abstract/EntityRequestBuilder'
import { BoardGrid } from '../Grid/Grid'

export default class Project extends BaseEntity {
  // ['constructor']: typeof Project

  static url = '/api/v3/projects'

  @Field()
    identifier: string

  @Field('name', String)
    name: string

  @Field('active', Boolean)
    active: boolean

  @Field('active', Boolean)
    public: boolean

  @Field('createdAt', Date)
    createdAt: Date

  @Field('updatedAt', Date)
    updatedAt: Date

  @Field('status', String)
    status: string

  @Link('parent', Project)
    parent: LinkEntity<Project> | null

  async filterInstanceSchemas (): Promise<Array<EntityCollectionElement<QueryFilterInstanceSchema>>> {
    return await QueryFilterInstanceSchema.getAll({
      url: `${this.self.href}/queries/filter_instance_schemas`
    })
  }

  body: IProjectBody

  workPackages<T extends WP>(target: new (...args: any[]) => T): EntityRequestBuilder<T> {
    return new EntityRequestBuilder<T>(target, {
      url: this.self.href + '/work_packages'
    })
  }

  public boards (): EntityRequestBuilder<BoardGrid> {
    return BoardGrid.request().addFilter('scope', '=', [`/projects/${this.id}/boards`])
  }
}
