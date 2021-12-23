import { sendRequest } from '@/utils/request'
import { ApiUrl } from '@/utils/config'

const accountUrl = '/account/verify'

export interface IAccountIn {
    email: string
}

export interface IAccountOut {
}

export function accountPost (params: IAccountIn) {
  return sendRequest<IAccountOut>('POST', accountUrl, params)
}

// 修改个人资料
export function accountEdit (params: {
  email: string,
  nickname: string
}) {
  return sendRequest<{}>('PUT', ApiUrl.account.edit, params)
}
