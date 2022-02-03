import React, {useEffect, useState} from 'react'
import {accountPost} from '@/services/account'
import {sessionPost} from '@/services/session'
import {updateTitle} from '@/utils/helpers'

function sendCodeToMail (mail: string, callback: (msg: any) => void) {
  const postData = {
    email: mail
  }
  accountPost(postData).catch((error) => {
    if (error.data && error.data.msg) {
      callback(error.data.msg)
    }
  })
}

function loginByCode (mail: string, code: string, callback: (msg: any) => void) {
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
      return <div className={'message-error'}>
        {error}
      </div>
    } else if (info) {
      return <div className={'message-info'}>
        {info}
      </div>
    }
    return <span></span>
  }
  useEffect(() => {
    updateTitle('登录')
  }, [])
  return <div className="account-page">
    <div className={'content-body fx-card'}>
      <div className={'row-mail'}>
        <input size={64} placeholder={'请输入邮箱'} className={'fx-text-field'}
               value={email} onChange={(event) => {
                 setEmail(event.target.value)
               }}/>
      </div>
      <div className={'row-password'}>
        <div className={'row-code'}>
          <input size={16} placeholder={'请输入验证码'} className={'fx-text-field'}
                 value={code} onChange={(event) => {
                   setCode(event.target.value)
                 }}/>
          <a className={'fx-link send-mail-link'} onClick={() => {
            sendCodeToMail(email, (msg) => {
              setError(msg)
            })
          }}>发送到邮箱</a>
        </div>
      </div>
      <div className={'row-login'}>
        <button className={'fx-primary-button'} onClick={() => {
          loginByCode(email, code, (msg) => {
            setError(msg)
          })
        }}>登录
        </button>
      </div>
      <div className={'row-message'}>
        {useErrorMessage()}
      </div>
    </div>
  </div>
}
