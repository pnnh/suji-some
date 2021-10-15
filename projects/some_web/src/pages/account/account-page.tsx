import React, { useEffect, useState } from 'react'
import { Link, MessageBar, MessageBarType, Stack } from '@fluentui/react'
import { accountPost } from '@/services/account'
import { sessionPost } from '@/services/session'
import { updateTitle } from '@/utils/helpers'

function sendCodeToMail (mail: string, callback: (msg: any)=>void) {
  const postData = {
    email: mail
  }
  accountPost(postData).then((out) => {
  }).catch((error) => {
    if (error.data && error.data.msg) {
      callback(error.data.msg)
    }
  })
}

function loginByCode (mail: string, code: string, callback: (msg: any)=>void) {
  const postData = {
    email: mail,
    code: code
  }
  sessionPost(postData).then((out) => {
    window.location.href = '/'
  }).catch((error) => {
    if (error.data && error.data.msg) {
      callback(error.data.msg)
    }
  })
}

export default function AccountPage () {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [info] = useState('')
  const useErrorMessage = () => {
    if (error) {
      return <MessageBar
                messageBarType={MessageBarType.error}
                isMultiline={false}
                dismissButtonAriaLabel="Close">
                {error}
            </MessageBar>
    } else if (info) {
      return <MessageBar
                messageBarType={MessageBarType.info}
                isMultiline={false}
                dismissButtonAriaLabel="Close">
                {info}
            </MessageBar>
    }
    return <span></span>
  }
  useEffect(() => {
    updateTitle('登录')
  }, [])
  return <div className="ms-Grid" dir="ltr">
            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12 ms-xl8">
                    <Stack tokens={{ childrenGap: 8 }}>
                        <Stack tokens={{ childrenGap: 32 }}>
                            <Stack.Item>
                                <input size={64} placeholder={'请输入邮箱'} className={'fx-text-field'}
                                       value={email} onChange={(event) => {
                                         setEmail(event.target.value)
                                       }} />
                            </Stack.Item>
                            <Stack.Item>
                                <Stack horizontal verticalAlign={'end'} tokens={{ childrenGap: 16 }}>
                                    <Stack.Item>
                                        <input size={16} placeholder={'请输入验证码'} className={'fx-text-field'}
                                               value={code} onChange={(event) => {
                                                 setCode(event.target.value)
                                               }} />
                                    </Stack.Item>
                                    <Stack.Item>
                                        <a onClick={() => {
                                          sendCodeToMail(email, (msg) => {
                                            setError(msg)
                                          })
                                        }}>发送到邮箱</a>
                                    </Stack.Item>
                                </Stack>
                            </Stack.Item>
                            <Stack.Item>
                                <button className={'fx-primary-button'} onClick={() => {
                                  loginByCode(email, code, (msg) => {
                                    setError(msg)
                                  })
                                }}>登录</button>
                            </Stack.Item>
                            <Stack.Item>
                                {useErrorMessage()}
                            </Stack.Item>
                        </Stack>
                    </Stack>
                </div>
            </div>
        </div>
}
