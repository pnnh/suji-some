import {sendRequest} from "@/services/utils/request";
import {ApiUrl} from "@/services/utils/config";

export interface IArticleIn {
    title: string
    body: string
}

export interface IArticleOut {
    pk: string
}

// 新建文章
export function articlePost(params: IArticleIn) {
    return sendRequest<IArticleOut>('POST', ApiUrl.article.new, params)
}

// 修改文章
export function articlePut(pk: string, params: IArticleIn) {
    return sendRequest<IArticleOut>('PUT', ApiUrl.article.edit + pk, params)
}
