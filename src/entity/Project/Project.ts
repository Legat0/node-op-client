import BaseEntity from "../Abstract/BaseEntity";
import ITypeBody from "../Type/ITypeBody";
import IProjectBody from "./IProjectBody";

export default class Project extends BaseEntity {
  ['constructor']: typeof Project

  static url = '/api/v3/projects'

  body: IProjectBody
}
