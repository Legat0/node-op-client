import { type IEndpoint } from './IEndpoint'

export interface IPayloadEndpoint<Payload> extends IEndpoint {
  payload: Payload
}
