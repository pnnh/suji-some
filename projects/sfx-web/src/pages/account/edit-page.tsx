import React, { useState } from 'react'
import { getJsonData, updateTitle } from '@/utils/helpers'

const AccountEditPage = () => {
  console.debug('EditPage')
  const serverData = getJsonData<any>()
  return <div className={'account-edit-page'}>
    <div className={'row-email'}>
      {serverData.email}
    </div>
    <div className={'row-nickname'}>
      {serverData.nickname}
    </div>
  </div>
}

export default AccountEditPage
