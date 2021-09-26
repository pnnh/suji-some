import { sendRequest } from '@/utils/request'
import { ApiUrl } from '@/utils/config'

export interface IArticleIn {
    title: string
    body: string
    description: string
    keywords: string
}

export interface IArticleOut {
    pk: string
}

// 新建文章
export function articlePost (params: IArticleIn) {
  return sendRequest<IArticleOut>('POST', ApiUrl.article.new, params)
}

// 修改文章
export function articlePut (pk: string, params: IArticleIn) {
  return sendRequest<IArticleOut>('PUT', ApiUrl.article.edit + pk, params)
}

// 删除文章
export function articleDelete (pk: string) {
  return sendRequest<IArticleOut>('DELETE', ApiUrl.article.delete + pk, {})
}
