import Field from '../decorators/Field'
import BaseEntityAny, { LinkEntity } from '../Abstract/BaseEntityAny'
import type IAbstractBody from '../Abstract/IAbstractBody'
import { type IEndpoint } from '../Abstract/IEndpoint'
import Link from '../decorators/Link'
import QueryColumn from './QueryColumn'

export type QuerySortDirectionType = 'asc' | 'desc'

export enum QuerySortDirectionEnum {
  asc = 'urn:openproject-org:api:v3:queries:directions:asc',
  desc = 'urn:openproject-org:api:v3:queries:directions:desc',
}

export interface QuerySortByBody extends IAbstractBody<string> {
  _type: 'QuerySortBy'
  name: string
  _links: {
    self: IEndpoint
    column: IEndpoint
    direction: {
      href: QuerySortDirectionEnum
      title: string
    }
  }

}

export default class QuerySortBy extends BaseEntityAny<string> {
  static url = '/api/v3/queries/sort_bys'

  @Field('name', String)
  public name: string

  @Link('column', QueryColumn)
  public column: LinkEntity<QueryColumn>

  get direction (): 'asc' | 'desc' {
    return this.body._links.direction.href === QuerySortDirectionEnum.asc ? 'asc' : 'desc'
  }

  set direction (v: any) {
    // TODO set direction
  }

  body: QuerySortByBody
}
