// 获取服务端以json格式传输的状态数据
export function getJsonData<T> (name = 'data'): T {
  const dataEl = document.getElementById(name)
  if (!dataEl) {
    return {} as T
  }
  return JSON.parse(dataEl.innerText)
}

export function getCSRF (): string | null {
  const data = getJsonData<any>()
  if (data && data.csrf) {
    return data.csrf
  }
  return null
}

export function updateTitle (title: string) {
  const elements = document.getElementsByTagName('title')
  if (!elements || elements.length < 1) {
    return
  }
  const titleEl = elements[0]
  titleEl.innerText = title + ' - 泛涵'
}

export function setLocalStorage (key: string, value: any) {
  const stringValue = JSON.stringify(value)
  localStorage.setItem(key, stringValue)
}

export function getLocalStorage (key: string): any {
  const stringValue = localStorage.getItem(key) ?? 'null'
  return JSON.parse(stringValue)
}
