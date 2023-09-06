import type IAbstractBody from '../Abstract/IAbstractBody'
import BaseEntityAny from '../Abstract/BaseEntityAny'
import type IFieldSchema from '../Schema/IFieldSchema'
import QueryFilter, { type QueryFilterBody } from './QueryFilter'
import QueryOperator, { type QueryOperatorBody } from './QueryOperator'
import { type CustomOptionBody } from '../CustomOption/CustomOption'
import { type FilterOperatorType } from 'contracts/FilterOperatorEnum'

type FilterFieldTypes = '[]CustomOption' | '[]User'

export interface BacklogsTypeBody extends IAbstractBody {
  _type?: 'BacklogsType'
  name: string
}

type ValuesSchema = IFieldSchema<FilterFieldTypes, CustomOptionBody | BacklogsTypeBody>

export interface SchemaDependency {
  _type: 'SchemaDependency'
  on: 'operator' | string
  /** key example = /api/v3/queries/operators/%26%3D */
  dependencies: Record<string, { values: ValuesSchema }>
}

export interface QueryFilterInstanceSchemaBody extends IAbstractBody<string> {
  _type: 'QueryFilterInstanceSchema'
  /** Доступные операторы + доступные значения */
  _dependencies: SchemaDependency[]
  name: IFieldSchema<'String'>
  filter: IFieldSchema<'QueryFilter', QueryFilterBody>
  operator: IFieldSchema<'QueryOperator', QueryOperatorBody>
  values?: ValuesSchema
}

export default class QueryFilterInstanceSchema extends BaseEntityAny<string> {
  public static url: string = '/api/v3/queries/filter_instance_schemas'

  body: QueryFilterInstanceSchemaBody

  public get allowedFilterValue (): QueryFilter {
    const filter = this.body.filter?._embedded?.allowedValues?.[0]
    return new QueryFilter(filter)
  }

  public get availableOperators (): QueryOperator[] {
    return (
      this.body.operator?._embedded?.allowedValues?.map(
        (x) => new QueryOperator(x)
      ) ?? []
    )
  }

  public get values (): ValuesSchema | undefined {
    return this.body.values
  }

  public get allowedValues (): Array< CustomOptionBody | BacklogsTypeBody > | null {
    return this.values?._embedded?.allowedValues ?? null
  }

  public isValueRequired (): boolean {
    return this.values != null
  }

  public isResourceValue (): boolean {
    return (this.values?._embedded?.allowedValues != null)
  }

  public loadedAllowedValues (): boolean {
    return Array.isArray(this.allowedValues)
  }

  public get dependency (): SchemaDependency {
    return this.body._dependencies[0]
  }

  public dependentOperatorSchema (op: QueryOperator | FilterOperatorType): { values: ValuesSchema } {
    const resultOperator = op instanceof QueryOperator ? op : new QueryOperator(op)
    const dependentSchema = this.dependency.dependencies[resultOperator.self.href ?? '']
    if (dependentSchema != null) {
      return dependentSchema
    } else {
      throw new Error(`dependency for operator ${resultOperator.id} not found`)
    }
  }

  public resultingSchema (
    operator: QueryOperator | FilterOperatorType
  ): QueryFilterInstanceSchema {
    const dependentSchema = this.dependentOperatorSchema(operator)

    return new QueryFilterInstanceSchema(
      Object.assign({}, this.body, {
        values: dependentSchema.values
      })
    )
  }
}
