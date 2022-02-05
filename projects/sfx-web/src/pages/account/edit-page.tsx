import React, {useRef, useState} from 'react'
import {getJsonData} from '@/utils/helpers'
import {ApiUrl} from '@/utils/config'
import {accountEdit} from '@/services/account'

const AccountEditPage = () => {
  console.debug('EditPage')
  const serverData = getJsonData<any>()
  const [nickname, setNickname] = useState<string>(serverData.nickname)
  const [email, setEmail] = useState<string>(serverData.email)
  const [description, setDescription] = useState<string>(serverData.description)
  const [site, setSite] = useState<string>(serverData.site)
  const [photoFile, setPhotoFile] = useState<File>()
  const fileInput = useRef<HTMLInputElement>(null)

  return <div className={'account-edit-page'}>
    <div className="content-body fx-card">
      <div className="user-info">
        <div className={'column-left'}>
          <div className={'row-email'}>
            <h3>账号</h3>
            {serverData.uname}
          </div>
          <div className={'row-nickname'}>
            <h3>昵称</h3>
            <input type={'text'} value={nickname} className={'fx-input'}
                   onChange={(event) => {
                     setNickname(event.target.value)
                   }} title={'昵称'}/>
          </div>
          <div className={'row-email'}>
            <h3>公开邮箱</h3>
            <input type={'text'} value={email} className={'fx-input'}
                   onChange={(event) => {
                     setEmail(event.target.value)
                   }} title={'对外显示的公开邮箱'}/>
          </div>
          <div className={'row-email'}>
            <h3>个人站点</h3>
            <input type={'text'} value={site} className={'fx-input'}
                   onChange={(event) => {
                     setSite(event.target.value)
                   }} title={'个人相关的站点主页'}/>
          </div>
          <div className={'row-description'}>
            <h3>描述</h3>
            <textarea value={description} className={'fx-input'}
                      rows={5} cols={56} maxLength={1024}
                      onChange={(event) => {
                        setDescription(event.target.value)
                      }} title={'描述'}/>
          </div>
          <div className={'row-photo'}>
            <input type={'file'}
                   ref={fileInput}
                   onChange={(event) => {
                     console.log('file', event.target.files)
                     if (event.target.files && event.target.files.length > 0) {
                       setPhotoFile(event.target.files[0])
                     }
                   }}/>
            <button onClick={e => {
              fileInput.current && fileInput.current.click()
            }} className="btn btn-primary">
              选择文件
            </button>
          </div>
          <div className={'row-submit'}>
            <button className={'fx-button'}
                    onClick={() => {
                      console.debug('修改个人资料', serverData.email, nickname)
                      const postData = {
                        nickname, photoFile, description, email, site
                      }
                      accountEdit(postData).then((out) => {
                        console.debug('修改个人资料返回 ', out)
                        if (out) {
                          window.location.href = ApiUrl.account.personal
                        }
                      })
                    }}>保存
            </button>
          </div>
        </div>
        <div className={'column-right'}>
          <div className="row-photo">
            <img alt="头像" className="photo" src={serverData.photo}/>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default AccountEditPage
