import BaseEntity from "../Abstract/BaseEntity";
import Link from "entity/decorators/Link";
import IRelationBody from "./IRelationBody";
import Field from "entity/decorators/Field";
import WP from "entity/WP/WP";

export enum RelationTypeEnum {
  TYPE_RELATES = 'relates',
  TYPE_DUPLICATES = 'duplicates',
  TYPE_DUPLICATED = 'duplicated',
  TYPE_BLOCKS = 'blocks',
  TYPE_BLOCKED = 'blocked',
  /** Предшествует. Используется на Ганте  */
  TYPE_PRECEDES = 'precedes',
  /** Следует. Используется на Ганте */
  TYPE_FOLLOWS = 'follows',
  TYPE_INCLUDES = 'includes',
  TYPE_PARTOF = 'partof',
  TYPE_REQUIRES = 'requires',
  TYPE_REQUIRED = 'required',
  TYPE_PARENT = 'parent',
  TYPE_CHILD = 'child',
}

export class Relation extends BaseEntity {
  public static url = '/api/v3/relations'

  public body: IRelationBody

  @Field('type', String)
  public type: RelationTypeEnum

  @Link('from', WP)
  public from: WP

  @Link('to', WP)
  public to: WP
}
