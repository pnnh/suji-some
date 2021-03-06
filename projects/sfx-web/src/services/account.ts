import { sendRequest } from '@/utils/request'
import { ApiUrl } from '@/utils/config'
import axios from 'axios'

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
  nickname: string,
  description: string,
  photoFile: any
}) {
  const formData = new FormData()
  formData.append('nickname', params.nickname)
  formData.append('description', params.description)
  formData.append('photoFile', params.photoFile)

  return axios.put(ApiUrl.account.edit, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(resp => {
    console.debug('accountEdit', resp)
    return resp
  }).catch((error) => {
    console.debug('accountEdit', error)
  })
}
