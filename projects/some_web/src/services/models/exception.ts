
// 错误码枚举
export enum ECodes {
  Success = 0,
  Fail = 1,
}

export class Exception {
  msg: string = ''
  code: ECodes = ECodes.Success
  param: any = {}
}

export function NewExceptionFail(msg: string, param?: string): Exception {
  let ex = new Exception()
  ex.code = ECodes.Fail
  ex.msg = msg
  ex.param = param ?? {}
  return ex
}

export function NewException(code: ECodes): Exception {
  let ex = new Exception()
  ex.code = code
  return ex
}

export function NewExceptionWithParam(code: ECodes, param: any): Exception {
  let ex = new Exception()
  ex.code = code
  ex.param = param
  return ex
}

export function NewExceptionWithMsg(code: ECodes, msg: string): Exception {
  let ex = new Exception()
  ex.code = code
  ex.msg = msg
  return ex
}

export function NewExceptionWithAll(code: ECodes, msg: string, param: any): Exception {
  let ex = new Exception()
  ex.code = code
  ex.msg = msg
  ex.param = param
  return ex
}
