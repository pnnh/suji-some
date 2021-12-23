import React, { useEffect, useState } from 'react'
import { updateTitle } from '@/utils/helpers'
import ReactDOM from 'react-dom'

function PersonalMenu () {
  return <button className={'fx-primary-button'} onClick={() => {
    window.location.href = '/account/edit'
  }}>
    修改资料
  </button>
}

export default function PersonalPage () {
  useEffect(() => {
    const rootElement = document.getElementById('user-menu')
    if (rootElement) {
      ReactDOM.render(<PersonalMenu/>, rootElement)
    }
  }, [])
  return <div></div>
}
