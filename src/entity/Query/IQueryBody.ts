import { IEndpoint } from "../Abstract/IEndpoint";
import { IPayloadEndpoint } from "../Abstract/IPayloadEndpoint";
import IAbstractBody from "../Abstract/IAbstractBody";

export default interface IQueryBody extends IAbstractBody {
  _type?: "Query";
  name: string; 
  _links: {
    self: IEndpoint;
  };
}
