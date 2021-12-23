import React, { useState } from 'react'
import { getJsonData, updateTitle } from '@/utils/helpers'
import { articlePut } from '@/services/article'
import { ApiUrl } from '@/utils/config'
import { accountEdit } from '@/services/account'

const AccountEditPage = () => {
  console.debug('EditPage')
  const serverData = getJsonData<any>()
  const [email, setEmail] = useState<string>(serverData.email)
  const [nickname, setNickname] = useState<string>(serverData.nickname)

  return <div className={'account-edit-page'}>
      <div className="content-body fx-card">
        <div className="user-info">
          <div className={'row-email'}>
            <h3>邮箱</h3>
            {/* <input type={'email'} value={ email } className={'fx-input'} */}
            {/*       pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" */}
            {/*       onChange={(event) => { */}
            {/*         setEmail(event.target.value) */}
            {/*       }} title={'邮箱'}/> */}
            {email}
          </div>
          <div className={'row-nickname'}>
            <h3>昵称</h3>
            <input type={'text'} value={ nickname } className={'fx-input'}
                   onChange={(event) => {
                     setNickname(event.target.value)
                   }} title={'昵称'}/>
          </div>
          <div className={'row-submit'}>
            <button className={'fx-button'}
                    onClick={() => {
                      console.debug('修改个人资料', email, nickname)
                      const postData = {
                        email, nickname
                      }
                      accountEdit(postData).then((out) => {
                        console.debug('修改个人资料返回 ', out)
                        if (out) {
                          window.location.href = ApiUrl.account.personal
                        }
                      })
                    }}>保存</button>
          </div>
        </div>
      </div>
  </div>
}

export default AccountEditPage
