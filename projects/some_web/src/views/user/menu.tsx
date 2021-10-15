import React from 'react'
import {
  Stack
} from '@fluentui/react'
import { getJsonData } from '@/utils/helpers'
import { ApiUrl } from '@/utils/config'

const useActionButton = () => {
  const auth = getJsonData<any>()
  if (auth && auth.login) {
    return <button className={'fx-primary-button'} onClick={() => {
      window.location.href = ApiUrl.article.new
    }}>
            创作
        </button>
  } else {
    return <button className={'fx-primary-button'} onClick={() => {
      window.location.href = '/account/login'
    }}>
            登录
        </button>
  }
}

export default function UserMenu () {
  return <Stack.Item align={'center'}>
            {useActionButton()}
        </Stack.Item>
}
