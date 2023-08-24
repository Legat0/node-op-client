import { IEndpoint } from "./IEndpoint";

export interface ISchemaBody {
  _type?: string;
  _links: {
    self: IEndpoint;
  };
}

export default interface IAbstractBody<IdType extends number | string = number>
  extends ISchemaBody {
  id: IdType; 
  _embedded?: {};
}
