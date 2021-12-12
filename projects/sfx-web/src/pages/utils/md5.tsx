import React, { useState } from 'react'

export default function MD5Page () {
  const [content, setContent] = useState<string>('')

  return <div className={'encrypt-md5-page'}>
    <div className={'content-body fx-card'}>
      <div className={'row-content'}>
        <textarea className={'fx-input'} placeholder={'请输入内容'}
               onChange={(event) => setContent(event.target.value)} />
      </div>
      <div className={'row-calc'}>
        <button className={'fx-button'}
                onClick={() => {
                  console.debug('content', content)
                }}>计算</button>
      </div>
    </div>

  </div>
}
