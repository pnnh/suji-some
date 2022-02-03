import React, {useEffect, useState} from 'react'
import {Module, QtLoader} from '@/utils/qtloader'
import {getHost} from '@/utils/config'

function initWasm () {
  window.Module = Module
  window.QtLoader = QtLoader
  Module.locateFile = function (path: string, prefix: string) {
    console.log('locateFile', path, prefix)
    return prefix + path
  }
  document.addEventListener('DOMContentLoaded', function () {
    console.log('3 seconds passed')
    const qtCanvas = document.getElementById('qt-canvas')
    if (qtCanvas) {
      const qtLoader = window.QtLoader({
        canvasElements: [qtCanvas],
        //showLoader: () => { },
        showError: function (errorMessage: string) {
          console.log('showError', errorMessage)
        },
        // showExit: function () {
        // },
        // showCanvas: function () {
        // }
      })
      const filePath = getHost() + '/wasm/qt-canvas'
      qtLoader.loadEmscriptenModule(filePath)
    }
  })
}

export default function MD5Page () {
  const [content, setContent] = useState<string>('')
  const [result, setResult] = useState<string>('')

  useEffect(() => {
    initWasm()
  }, [[]])

  return <div className={'encrypt-md5-page'}>
    <div className={'content-body fx-card'}>
      <div className={'row-content'}>
        <textarea className={'fx-input'} placeholder={'请输入内容'}
                  onChange={(event) => setContent(event.target.value)}/>
      </div>
      <div className={'row-calc'}>
        <button className={'fx-button'}
                onClick={() => {
                  const result = window.Module.tryCalcMd5(content)
                  setResult(result)
                }}>MD5
        </button>
        <button className={'fx-button'}
                onClick={() => {
                  const result = window.Module.tryCalcBase64(content)
                  setResult(result)
                }}>Base64
        </button>
        <button className={'fx-button'}
                onClick={() => {
                  const result = window.Module.tryCalcHex(content)
                  setResult(result)
                }}>HEX
        </button>
        <button className={'fx-button'}
                onClick={() => {
                  const result = window.Module.tryCalcSha1(content)
                  setResult(result)
                }}>SHA1
        </button>
        <button className={'fx-button'}
                onClick={() => {
                  const result = window.Module.tryCalcSha256(content)
                  setResult(result)
                }}>SHA256
        </button>
        <button className={'fx-button'}
                onClick={() => {
                  const result = window.Module.tryCalcSha512(content)
                  setResult(result)
                }}>SHA512
        </button>
      </div>
      <div className={'row-result'}>
        {result}
      </div>
    </div>

  </div>
}
