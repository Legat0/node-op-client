import { type IEndpoint } from '../Abstract/IEndpoint'
import type IAbstractBody from '../Abstract/IAbstractBody'

export default interface IMembershipBody extends IAbstractBody {
  _type?: 'Membership'
  lockVersion?: number

  _embedded?: {
    project?: {
      _type: 'Project'
      id: number
      identifier: string
      name: string
      active: boolean
      public: boolean
      description: {
        format: string
        raw: string
        html: string
      }
      _links?: {
        self?: IEndpoint
        createWorkPackage?: IEndpoint
        createWorkPackageImmediately?: IEndpoint
        workPackages?: IEndpoint
        categories?: IEndpoint
        versions?: IEndpoint
        memberships?: IEndpoint
        types?: IEndpoint
        update?: IEndpoint
        updateImmediately?: IEndpoint
        delete?: IEndpoint
        schema?: IEndpoint
        parent?: IEndpoint
      }
    }
    principal?: {
      _type: 'User'
      id: number
      name: string
      createdAt: string
      updatedAt: string
      login: string
      admin: boolean
      firstName: string
      lastName: string
      email: string
      avatar: string
      status: string
      identityUrl: string
      _links: {
        self: IEndpoint
        memberships: IEndpoint
        showUser: IEndpoint
        updateImmediately: IEndpoint
        lock: IEndpoint
        delete: IEndpoint
      }
    }
    roles: Array<{
      _type: 'Role'
      id: number
      name: string
      _links: {
        self: IEndpoint
      }
    }>
  }

  _links: IAbstractBody['_links'] & {
    roles?: IEndpoint[]
    principal?: IEndpoint
    project?: IEndpoint
  }
  _meta?: { notificationMessage?: object, sendNotifications?: boolean }
}
