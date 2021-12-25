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
                  setResult(result)
                }}>MD5</button>
        <button className={'fx-button'}
                onClick={() => {
                  const result = window.Module.tryCalcBase64(content)
                  setResult(result)
                }}>Base64</button>
        <button className={'fx-button'}
                onClick={() => {
                  const result = window.Module.tryCalcHex(content)
                  setResult(result)
                }}>HEX</button>
        <button className={'fx-button'}
                onClick={() => {
                  const result = window.Module.tryCalcSha1(content)
                  setResult(result)
                }}>SHA1</button>
        <button className={'fx-button'}
                onClick={() => {
                  const result = window.Module.tryCalcSha256(content)
                  setResult(result)
                }}>SHA256</button>
        <button className={'fx-button'}
                onClick={() => {
                  const result = window.Module.tryCalcSha512(content)
                  setResult(result)
                }}>SHA512</button>
      </div>
      <div className={'row-result'}>
        {result}
      </div>
    </div>

  </div>
}
