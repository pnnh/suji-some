import { sendRequest } from '@/utils/request'
import { ApiUrl } from '@/utils/config'
import axios from 'axios'

export interface IPostIn {
  body: string
}

export interface IPostOut {
  pk: string
}

export interface IPost {
  pk: string
  body: string
  creator: string
  creator_nickname: string
  create_time: Date
  update_time: Date
}

export interface ISelectPostOut {
  list: IPost[]
  maxPage: number
}

export function convertTime (postList: IPost[]) {
  for (const post of postList) {
    console.log('selectResult===', post)
    post.create_time = new Date(post.create_time)
    post.update_time = new Date(post.update_time)
    console.log('selectResult===222', post)
  }
  return postList
}

// 动态列表
export function selectPost (page: number) {
  const formData = new FormData()
  formData.append('p', page.toString())

  return axios.post<ISelectPostOut>(ApiUrl.post.list, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(selectResult => {
    console.log('selectResult', selectResult)
    if (!selectResult.data) {
      return selectResult.data
    }
    selectResult.data.list = convertTime(selectResult.data.list)
    return selectResult.data
  }).catch((error) => {
    console.debug('selectPost', error)
  })
}

// 新建动态
export function createPost (params: IPostIn) {
  const formData = new FormData()
  formData.append('body', params.body)

  return axios.post(ApiUrl.post.new, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(resp => {
    return resp
  }).catch((error) => {
    console.debug('createPost', error)
  })
}

// 删除动态
export function deletePost (pk: string) {
  return sendRequest<IPostOut>('DELETE', ApiUrl.post.delete + pk, {})
}
