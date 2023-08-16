import entityManager, {EntityManager} from "./EntityManager/EntityManager";
import BaseEntity from "./entity/Abstract/BaseEntity";
import Duration from "./entity/Abstract/Duration";
import CustomOption from "./entity/CustomOption/CustomOption";
import Project from "./entity/Project/Project";
import Status from "./entity/Status/Status";
import Type from "././entity/Type/Type";
import TypeEnum from "././entity/Type/TypeEnum";
import User from "./entity/User/User";
import WP from "./entity/WP/WP";

import Field from "./entity/decorators/Field";
import Link from "./entity/decorators/Link";
import Embedded from "./entity/decorators/Embedded";
import StatusEnum from "./entity/Status/StatusEnum";
import { EntityFilterItem } from "contracts/EntityFilterItem";

export {
  EntityManager,
  BaseEntity,
  CustomOption,
  Project,
  Status,
  StatusEnum,
  Type,
  TypeEnum,
  WP,
  Link,
  Field,
  Embedded,
  Duration,
  User,  

  EntityFilterItem
};

export default entityManager

export function customFieldName(id?: number | bigint) {
  return id ? 'customField' + id : ''
}
