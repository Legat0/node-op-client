import { IEndpoint } from "../Abstract/IEndpoint";
import { IPayloadEndpoint } from "../Abstract/IPayloadEndpoint";
import IAbstractBody from "../Abstract/IAbstractBody";
import { VersionStatusEnum } from "./Version";
import IProjectBody from "entity/Project/IProjectBody";

export default interface IVersionBody extends IAbstractBody {
  _type?: "Version";
  /** Название версии/спринта/этапа. Уникальное в рамках проекта */
  name: string;
  // description: string
  startDate: string;
  endDate: string;
  status: VersionStatusEnum;

  _embedded?: {
    project?: IProjectBody;
  };

  _links: IAbstractBody["_links"] & {
    definingProject?: IEndpoint;
  };
}
