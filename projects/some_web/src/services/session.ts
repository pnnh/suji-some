import {sendRequest} from "@/utils/request";

const sessionUrl = '/account/login'

export interface ISessionIn {
    email: string
    code: string
}

export interface ISessionOut {
}

export function sessionPost(params: ISessionIn) {
    return sendRequest<ISessionOut>('POST', sessionUrl, params);
}
