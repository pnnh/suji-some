import React from 'react'
import { getJsonData } from '@/utils/helpers'
import { ApiUrl } from '@/utils/config'
import { isScreenPhone, isScreenTablet } from '@/utils/media'

const useActionButton = () => {
  const auth = getJsonData<any>()
  if (auth && auth.login) {
    return <> <button className={'fx-primary-button new-button'} onClick={() => {
      window.location.href = ApiUrl.article.new
    }}>
            创作
        </button>
      <button className={'fx-primary-button'} onClick={() => {
        window.location.href = '/account/personal'
      }}>
        个人资料
      </button>
    </>
  } else {
    return <> <button className={'fx-primary-button'} onClick={() => {
      window.location.href = '/account/login'
    }}>
            登录
        </button>
    </>
  }
}

export default function UserMenu () {
  return <>
            {useActionButton()}
        </>
}
