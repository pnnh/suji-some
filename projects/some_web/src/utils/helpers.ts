
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

export function updateTitle(title: string) {
    const elements = document.getElementsByTagName("title");
    if (!elements || elements.length < 1) {
        return;
    }
    const titleEl = elements[0];
    titleEl.innerText = title + " - 泛函";
}
