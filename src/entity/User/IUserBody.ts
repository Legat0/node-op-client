import type IAbstractBody from '../Abstract/IAbstractBody'

export default interface IUserBody extends IAbstractBody {
  '_type'?: 'Type'
  'name': string
  'createdAt': string
  'updatedAt': string
  'login': string
  'admin': boolean
  'firstName': string
  'lastName': string
  'email': string
  'avatar': string
  'status': string
  'identityUrl': any
}
