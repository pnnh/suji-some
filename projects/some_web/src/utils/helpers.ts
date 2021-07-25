import {StatusInternalServerError, StatusOK} from "@/services/models/status";

export function getPageStatus(): number {
    const dataEl = document.getElementById("noscript");
    if (!dataEl) {
        return StatusOK;
    }
    const prop = dataEl.getAttribute('data-s');
    if (prop) {
        const status = parseInt(String(prop));
        return Number.isInteger(status) ? status : StatusInternalServerError;
    }
    return StatusOK;
}

// 获取服务端以json格式传输的状态数据
export function getJsonData<T>(name: string = "data"): T {
    const dataEl = document.getElementById(name);
    if (!dataEl) {
        return {} as T;
    }
    return JSON.parse(dataEl.innerText);
}

export function getCSRF(): string | null {
    const data = getJsonData<any>();
    if (data && data.csrf) {
        return data.csrf;
    }
    return null;
}
