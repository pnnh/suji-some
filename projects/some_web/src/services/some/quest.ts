import {sendRequest} from "@/services/utils/request";
import {getApiUrl} from "@/services/utils/config";

export interface IQuestIn {
    title: string
}

export interface IQuestOut {
    count: number;
    rows: Quest[];
}

// 新建quest
export function questPost(params: IQuestIn) {
    return sendRequest<Quest>('POST', getApiUrl() + "/quest", params)
}

// 获取quest列表
export function questQuery(params: {}) {
    return sendRequest<IQuestOut>('GET', getApiUrl() + "/quest", params)
}
