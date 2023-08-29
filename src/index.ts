import entityManager, {
  EntityManager,
  AuthTypeEnum  
} from "./EntityManager/EntityManager";

import BaseEntityAny from "./entity/Abstract/BaseEntityAny";
import BaseEntity from "./entity/Abstract/BaseEntity";

import Duration from "./entity/Abstract/Duration";
import EntityRequestBuilder from "./entity/Abstract/EntityRequestBuilder";
import CustomOption from "./entity/CustomOption/CustomOption";
import Project from "./entity/Project/Project";
import Status from "./entity/Status/Status";
import Type from "././entity/Type/Type";
import TypeEnum from "././entity/Type/TypeEnum";
import User from "./entity/User/User";
import WP from "./entity/WP/WP";
import Query from "./entity/Query/Query";
import QueryForm from "./entity/Query/QueryForm";
import QueryFilterInstanceSchema from "./entity/Query/QueryFilterInstanceSchema";

import Field from "./entity/decorators/Field";
import Link from "./entity/decorators/Link";
import Embedded from "./entity/decorators/Embedded";
import JsonField from "./entity/decorators/JsonField";
import LinkArray from "./entity/decorators/LinkArray";
import StatusEnum from "./entity/Status/StatusEnum";

export { type EntityFilterItem } from "./contracts/EntityFilterItem";

export { type EntityManagerConfig, type ICollectionStat, CollectionStat  } from "./EntityManager/EntityManager";
export {
  type LinkEntity,
  type EntityCollectionElement,
} from "./entity/Abstract/BaseEntityAny";

export {
  EntityManager,  
  AuthTypeEnum,
  BaseEntityAny,
  BaseEntity,
  EntityRequestBuilder,
  CustomOption,
  Project,
  Status,
  StatusEnum,
  Type,
  TypeEnum,
  WP,
  Query,
  QueryForm,
  QueryFilterInstanceSchema,
  Link,
  Field,
  Embedded,
  JsonField,
  LinkArray,
  Duration,
  User,
};

export default entityManager;

export function customFieldName(id?: number | bigint) {
  return id ? "customField" + id : "";
}
