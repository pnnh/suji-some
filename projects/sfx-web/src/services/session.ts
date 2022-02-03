import {sendRequest} from '@/utils/request'

const sessionUrl = '/account/login'

export interface ISessionIn {
  email: string
  code: string
}

export function sessionPost (params: ISessionIn) {
  return sendRequest<unknown>('POST', sessionUrl, params)
}
