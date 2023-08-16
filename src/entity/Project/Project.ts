
import Field from "../decorators/Field";
import BaseEntity, { IPartialAbstractBody } from "../Abstract/BaseEntity";
import IProjectBody from "./IProjectBody";

export interface IPartialProjectBody extends Partial< Omit<IProjectBody, '_links'>>{
  _links?: Partial<IProjectBody['_links']>
}
export default class Project extends BaseEntity{
  // ['constructor']: typeof Project

  static url = '/api/v3/projects'

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

  body: IProjectBody

}
