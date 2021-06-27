import axios, {AxiosRequestConfig, Method} from 'axios'
import {getCSRF} from "@/services/utils/helpers";

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  //baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 20 * 1000, // 请求超时时间,
  headers: { "r": getCSRF() }
})

export function sendRequest<T>(method: Method, url: string, params: unknown) {
  let config = {
    url: url,
    method: method,
    timeout: 10 * 1000,
  } as AxiosRequestConfig
  if (method == 'GET') {
    config.params = params
  } else if (method == 'POST' || method == 'PUT') {
    config.data = params
  }
  return request.request<T>(config).then(resp => {
    return resp.data;
  }).catch((error) => {
    if (error.response) {
      throw {status: error.response.status, data: error.response.data};
    }
  });
}

export default request
