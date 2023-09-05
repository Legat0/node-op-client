import Field from '../decorators/Field'
import Link from '../decorators/Link'
import BaseEntity from '../Abstract/BaseEntity'
import Project from '../Project/Project'
import { LinkEntity } from '../Abstract/BaseEntityAny'

import Query from '../Query/Query'
import type IViewBody from './IViewBody'
import EntityRequestBuilder from '../Abstract/EntityRequestBuilder'
import { type GetManyOptions } from 'EntityManager/EntityManager'
import { ViewsTypeEnum } from './IViewBody'

// export
export class ViewRequestBuilder<T extends BaseEntity = View> extends EntityRequestBuilder<T> {
  public whereProjectNull (): ViewRequestBuilder<T> {
    return this.addFilter('project', '!*')
  }

  public whereProject (projectId: number): ViewRequestBuilder<T> {
    return this.addFilter('project', '=', [projectId])
  }

  public whereType (type: ViewsTypeEnum): ViewRequestBuilder<T> {
    return this.addFilter('type', '=', [type])
  }

  public workPackagesTable (): ViewRequestBuilder<T> {
    return this.addFilter('type', '=', [ViewsTypeEnum.WorkPackagesTable])
  }

  public teamPlanner (): ViewRequestBuilder<T> {
    return this.addFilter('type', '=', [ViewsTypeEnum.TeamPlanner])
  }

  public workPackagesCalendar (): ViewRequestBuilder<T> {
    return this.addFilter('type', '=', [ViewsTypeEnum.WorkPackagesCalendar])
  }
}

export default class View extends BaseEntity {
  public static url: string = '/api/v3/views'

  @Field('_type', String)
    type: ViewsTypeEnum

  @Field()
  readonly name: string

  @Field()
  readonly public: boolean

  @Field()
  readonly starred: boolean

  @Link('project', Project)
  readonly project?: LinkEntity<Project>

  @Link('query', Query)
    query: LinkEntity<Query>

  public static request<T extends BaseEntity>(
    this: new () => T,
    options?: GetManyOptions
  ): ViewRequestBuilder<T> {
    return new ViewRequestBuilder<T>(this, options, undefined)
  }

  public static workPackagesTable (): ViewRequestBuilder {
    return this.request().workPackagesTable()
  }

  // public static create(type: ViewsTypeEnum, query: Query) {
  //   const view = 1
  //   // return this.getService().create()
  // }

  public createUrl (): string {
    switch (this.type) {
      case ViewsTypeEnum.WorkPackagesTable:
        return View.url + '/work_packages_table'
      case ViewsTypeEnum.TeamPlanner:
        return View.url + '/team_planner '
      case ViewsTypeEnum.WorkPackagesCalendar:
        return View.url + '/work_packages_calendar '

      default:
        throw new Error('invalid View type')
    }
  }

  public async create<T extends View>(
    this: T
  ): Promise<T> {
    return await this.getService().create(this, {
      url: this.createUrl()
    })
  }

  // work_packages_table

  body: IViewBody
}
