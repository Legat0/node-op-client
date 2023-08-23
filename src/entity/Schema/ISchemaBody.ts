import { IEndpoint } from "../Abstract/IEndpoint";
import { IPayloadEndpoint } from "../Abstract/IPayloadEndpoint";
import IAbstractBody from "../Abstract/IAbstractBody";

export interface IFieldSchema {
  type: "DateTime" | string;
  name: string;
  required: boolean;
  hasDefault: boolean;
  writable: boolean;
  options: object;
  location?: "_links" | string;
  _links?: {
    allowedValues?: IEndpoint;
  };
}

type ISchemaBodyFields =   { [k: string]: IFieldSchema } //& { [K in `_${string}`]?: never }

export default interface ISchemaBody extends  Omit<IAbstractBody, 'id'> {
  _type: "Schema";
  _dependencies: any[]; 
  _embedded: {};
  _links: {
    self: IEndpoint;
  };
}
