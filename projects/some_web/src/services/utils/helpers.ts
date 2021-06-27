import {StatusInternalServerError, StatusOK} from "@/services/models/status";

function parseValue(element: HTMLElement): any {
    let dataValue = {};
    const dataType = element.getAttribute('data-type');
    const dataName = element.getAttribute('data-name');
    if(element.children.length < 1) {
        const dv = element.getAttribute('data-value') || element.innerHTML;
        if (dv == 'true' || dv == 'TRUE') {
            dataValue = true;
        } else if (dv == 'false' || dv == 'FALSE') {
            dataValue = false;
        } else {
            const numVal = Number(dv)   // 可能是一个数字
            if(!isNaN(numVal)) {
                dataValue = numVal
            } else {
                const dateVal = Date.parse(dv);   // 可能日期格式
                if(!isNaN(dateVal)) {
                    dataValue = new Date(dateVal);
                } else {
                    dataValue = dv;
                }
            }
        }
        if(dataName) {
            let data = {};
            data[dataName] = dataValue;
            dataValue = data;
        }
        return dataValue;
    }
    if (dataType == 'array') {
        let propValue: any[] = [];
        for(let i = 0; i < element.children.length; i += 1) {
            const childData = parseValue(element.children[i] as HTMLElement);
            for(let name in childData) {
                if (!childData.hasOwnProperty(name)) {
                    continue;
                }
                propValue.push(childData[name]);
            }
        }
        dataValue = propValue;
    } else {
        let propValue = {};
        for(let i = 0; i < element.children.length; i += 1) {
            const childData = parseValue(element.children[i] as HTMLElement);
            for(let name in childData) {
                if (!childData.hasOwnProperty(name)) {
                    continue;
                }
                propValue[name] = childData[name];
            }
        }
        dataValue = propValue;
    }
    if(dataName) {
        let data = {};
        data[dataName] = dataValue;
        dataValue = data;
    }
    return dataValue;
}

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

// 获取服务端以xml格式传输的状态数据
export function getXmlData<T>(): T {
    const dataEl = document.getElementById("noscript");
    if (!dataEl || !dataEl.innerText) {
        return {} as T;
    }
    const oParser = new DOMParser();
    const oDOM = oParser.parseFromString(dataEl.innerText, "application/xml");
    if (oDOM.documentElement.nodeName == "parsererror") {
        return {} as T;
    }
    const root = parseValue(oDOM.documentElement);
    return root.data as T;
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
