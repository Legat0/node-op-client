import entityManager, {
  EntityManager,
  AuthTypeEnum
} from './EntityManager/EntityManager'

import BaseEntityAny from './entity/Abstract/BaseEntityAny'
import BaseEntity from './entity/Abstract/BaseEntity'

import Duration from './entity/Abstract/Duration'
import EntityRequestBuilder from './entity/Abstract/EntityRequestBuilder'
import CustomOption from './entity/CustomOption/CustomOption'

import Status from './entity/Status/Status'
import Type from '././entity/Type/Type'
import Priority from '././entity/Priority/Priority'
import TypeEnum from '././entity/Type/TypeEnum'
import User from './entity/User/User'
import PlaceholderUser from './entity/User/PlaceholderUser'
import Group from './entity/Group/Group'
import Principal from './entity/Principal/Principal'
import Role from './entity/Role/Role'
import Grid, { BoardGrid, GridWidget, GridWidgetQuery } from './entity/Grid/Grid'
import Version from './entity/Version/Version'
import WP from './entity/WP/WP'
import Query from './entity/Query/Query'
import QueryFilter from './entity/Query/QueryFilter'
import QueryOperator from './entity/Query/QueryOperator'

import View from './entity/View/View'
import QueryForm from './entity/Query/QueryForm'
import QueryFilterInstanceSchema from './entity/Query/QueryFilterInstanceSchema'
import Project from './entity/Project/Project'
import Notification from './entity/Notification/Notification'

import Field from './entity/decorators/Field'
import Link from './entity/decorators/Link'
import Embedded from './entity/decorators/Embedded'
import EmbeddedArray from './entity/decorators/EmbeddedArray'
import JsonField from './entity/decorators/JsonField'
import LinkArray from './entity/decorators/LinkArray'
import StatusEnum from './entity/Status/StatusEnum'

export { PrincipalTypeEnum } from './entity/Principal/Principal'
export { type EntityFilterItem } from './contracts/EntityFilterItem'
export { FilterOperatorEnum } from './contracts/FilterOperatorEnum'
export { ViewsTypeEnum } from './entity/View/IViewBody'
export { GridTypeEnum } from './entity/Grid/IGridBody'
export { type InputQueryFilterInstance } from './entity/Query/Query'

export { type EntityManagerConfig, type ICollectionStat, CollectionStat } from './EntityManager/EntityManager'
export {
  type LinkEntity,
  type EntityCollectionElement
} from './entity/Abstract/BaseEntityAny'

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
  Priority,
  Type,
  Version,
  TypeEnum,
  WP,
  View,
  Grid,
  BoardGrid,
  GridWidget,
  GridWidgetQuery,
  Query,
  QueryFilter,
  QueryOperator,
  QueryForm,
  QueryFilterInstanceSchema,
  Link,
  Field,
  Embedded,
  EmbeddedArray,
  JsonField,
  LinkArray,
  Duration,
  Role,
  Principal,
  PlaceholderUser,
  User,
  Notification,
  Group
}

export default entityManager

export function customFieldName (id?: number | bigint): string {
  return (id != null) ? 'customField' + id : ''
}
