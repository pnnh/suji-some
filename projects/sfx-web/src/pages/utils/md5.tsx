import React, { useState } from 'react'

export default function MD5Page () {
  const [content, setContent] = useState<string>('')
  const [result, setResult] = useState<string>('')

  return <div className={'encrypt-md5-page'}>
    <div className={'content-body fx-card'}>
      <div className={'row-content'}>
        <textarea className={'fx-input'} placeholder={'请输入内容'}
               onChange={(event) => setContent(event.target.value)} />
      </div>
      <div className={'row-calc'}>
        <button className={'fx-button'}
                onClick={() => {
                  const result = window.Module.tryCalcMd5(content)
                  console.debug('content', content, result)
                  setResult(result)
                }}>计算</button>
      </div>
      <div className={'row-result'}>
        {result}
      </div>
    </div>

  </div>
}
