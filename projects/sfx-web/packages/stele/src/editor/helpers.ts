export function setLocalStorage (key: string, value: any) {
  const stringValue = JSON.stringify(value)
  localStorage.setItem(key, stringValue)
}

export function getLocalStorage (key: string) :any {
  const stringValue = localStorage.getItem(key) ?? 'null'
  return JSON.parse(stringValue)
}
