import React, { useEffect, useState } from 'react'
import { updateTitle } from '@/utils/helpers'

export default function PersonalPage () {
  useEffect(() => {
    updateTitle('个人中心')
  }, [])
  return <div className="personal-page">
    <div className={'content-body fx-card'}>
      <div className={'row-username'}>
        你好哈哈
      </div>
    </div>
  </div>
}
