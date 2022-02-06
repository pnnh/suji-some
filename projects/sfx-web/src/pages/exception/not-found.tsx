import React from 'react'

export default function NotFoundPage () {
  return <div className={'not-found-page'}>
    <div className={'page-content'}>
      <h2>页面未找到</h2>
      <button className={'fx-primary-button'} onClick={() => {
        window.location.href = '/'
      }}>
        前往首页
      </button>

    </div>
  </div>
}
