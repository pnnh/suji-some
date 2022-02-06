import React from 'react'

export default function UnauthorizedPage () {
  return <div>
        <h2>您尚未登录或无权访问该页面</h2>
        <button className={'fx-primary-button'} onClick={() => {
          window.location.href = '/account/login'
        }}>
            前往登录
        </button>
    </div>
}
