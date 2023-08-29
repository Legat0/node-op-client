import type IAbstractBody from '../../entity/Abstract/IAbstractBody'
import Field from '../../entity/decorators/Field'
import BaseEntity from '../Abstract/BaseEntity'

export interface CustomOptionBody extends IAbstractBody {
  _type?: 'CustomOption'
  value: string
}
/**
 * Custom option
 */
export default class CustomOption extends BaseEntity {
  // ["constructor"]: typeof CustomOption;

  static url = '/api/v3/custom_options'

  @Field('value', String)
    value: string

  body: CustomOptionBody
}

export class JsonCustomOption<T extends object> extends CustomOption {
  get data (): T | undefined {
    return this.parseSelf<T>()
  }
}
