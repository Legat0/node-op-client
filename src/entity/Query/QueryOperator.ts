import Field from '../decorators/Field'
import BaseEntityAny, { type IPartialAbstractBody } from '../Abstract/BaseEntityAny'
import type IAbstractBody from '../Abstract/IAbstractBody'
import { type IEndpoint } from 'entity/Abstract/IEndpoint'
import { type FilterOperatorType } from 'contracts/FilterOperatorEnum'

export interface QueryOperatorBody extends IAbstractBody<string> {
  _type?: 'QueryOperator'
  /** example: ИЛИ, не, не пусто */
  name: string
}

export default class QueryOperator extends BaseEntityAny<string> {
  static url = '/api/v3/queries/operators'

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (
    init?: FilterOperatorType | IEndpoint | IPartialAbstractBody
  ) {
    super(init)
  }

  public static make<T extends BaseEntityAny>(this: new (...args: any[]) => T, operator?: FilterOperatorType | IEndpoint): T {
    return new this(operator)
  }

  @Field('name', String)
  public name: string

  body: QueryOperatorBody
}
