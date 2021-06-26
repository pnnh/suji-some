import {sendRequest} from "@/services/utils/request";

const accountUrl = '/account/verify'

export interface IAccountIn {
    email: string
}

export interface IAccountOut {
}

export function accountPost(params: IAccountIn) {
    return sendRequest<IAccountOut>('POST', accountUrl, params);
}
