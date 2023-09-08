import { type IEndpoint } from '../Abstract/IEndpoint'
import type IAbstractBody from '../Abstract/IAbstractBody'

export enum ViewsTypeEnum {
  WorkPackagesTable = 'Views::WorkPackagesTable',
  TeamPlanner = 'Views::TeamPlanner',
  WorkPackagesCalendar = 'Views::WorkPackagesCalendar',
}

/** https://www.openproject.org/docs/api/endpoints/views/#api-views */
export default interface IViewBody extends IAbstractBody {
  _type?: ViewsTypeEnum
  name: string
  public: boolean
  starred: boolean
  externalCanbanId: string // XXX ref to meteor-1c
  _links: {
    self: IEndpoint
    project: IEndpoint
    query: IEndpoint

  }
}
