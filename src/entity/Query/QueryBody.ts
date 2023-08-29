import { type IEndpoint } from '../Abstract/IEndpoint'
import type IAbstractBody from '../Abstract/IAbstractBody'

export default interface QueryBody extends IAbstractBody {
  _type?: 'Form'
  _embedded: {
    payload: {
      starred: boolean
      name: string
      filters: object[]
      includeSubprojects: boolean
      public: boolean
      timelineVisible: boolean
      showHierarchies: boolean
      timelineZoomLevel: 'auto' | string
      timelineLabels: object
      highlightingMode: 'inline' | string
      _links: {
        project: IEndpoint
        sortBy: IEndpoint[]
        groupBy: IEndpoint
        columns: IEndpoint[]
        highlightedAttributes: IEndpoint[]

      }
    }
    schema: object
  }
  _links: {
    self: IEndpoint
  }
}
