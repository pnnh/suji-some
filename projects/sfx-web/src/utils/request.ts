import type {AxiosRequestConfig, Method} from 'axios'
import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  // baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 20 * 1000 // 请求超时时间,
  // headers: { "r": getCSRF() }  // todo 这个暂时不能携带，因为在ktor服务端，这个被认为是未知header
})

export function sendRequest<T> (method: Method, url: string, params: unknown) {
  const config = {
    url: url,
    method: method,
    timeout: 10 * 1000
  } as AxiosRequestConfig
  if (method === 'GET') {
    config.params = params
  } else if (method === 'POST' || method === 'PUT') {
    config.data = params
  }
  return request.request<T>(config).then(resp => {
    return resp.data
  })
}

export default request
