import IAbstractBody from "../Abstract/IAbstractBody";

export default interface IRelationBody extends IAbstractBody {
  _type?: 'Relation'
  name: string
  type: string
  reverseType: string
  delay: number
  description: string
  _links: IAbstractBody['_links']
}
