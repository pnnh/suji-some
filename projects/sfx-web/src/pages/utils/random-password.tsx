import React, { useState } from 'react'
import { randomPassword } from '@/utils/rand'

export default function RandomPasswordPage () {
  const [password, setPassword] = useState<string>('')
  const [length, setLength] = useState<number>(16)
  const [passwordHistory, setPasswordHistory] = useState<string[]>([])
  const [allowLetter, setAllowLetter] = useState<boolean>(true)
  const [allowUppercaseLetter, setAllowUppercaseLetter] = useState<boolean>(true)
  const [allowSymbol, setAllowSymbol] = useState<boolean>(true)
  const [allowNumber, setAllowNumber] = useState<boolean>(true)

  const renderPassword = () => {
    if (password.length < 1) {
      return <span></span>
    }
    return <>
      <h2>生成的密码</h2>
      <div className={'gen-password'} title={'长度' + String(password.length)}>{password}</div>
    </>
  }
  const renderHistory = () => {
    if (passwordHistory.length < 1) {
      return <span></span>
    }
    const historyList = passwordHistory.map(pwd => {
      return <div key={pwd} title={'长度' + String(pwd.length)} className={'password-item'}>
        {pwd}
      </div>
    })
    return <>
      <h2>历史密码</h2>
      {historyList}
    </>
  }
  return <div className={'random-password-page'}>
    <div className={'random-password'}>
      <div>
        <h2 className={'tool-title'}>随机密码生成器</h2>
        <p className={'tool-desc'}>本页生成的密码不会保持，刷新或关闭页面后消失</p>
      </div>
      <div className={'symbol-row'}>
        <label>
          <input type={'checkbox'} checked={allowLetter} title={'a-z'} onChange={(event) => {
            console.debug('radio', event.target.checked)
            setAllowLetter(event.target.checked)
          }}/>
          小写字母
        </label>
        <label>
          <input type={'checkbox'} title={'A-Z'} checked={allowUppercaseLetter} onChange={(event) => {
            setAllowUppercaseLetter(event.target.checked)
          }}/>
          大写字母
        </label>
        <label>
          <input type={'checkbox'} title={'0-9'} checked={allowNumber} onChange={(event) => {
            setAllowNumber(event.target.checked)
          }}/>
          数字
        </label>
        <label>
          <input type={'checkbox'} title={'@#$...'} checked={allowSymbol} onChange={(event) => {
            setAllowSymbol(event.target.checked)
          }}/>
          特殊字符
        </label>
      </div>
      <div className={'length-row'}>
        <input value={length} className={'fx-input'}
               onChange={(event) => {
                 setLength(Number(event.target.value))
               }} title={'密码长度'} type={'number'} min={4} max={64}/>
      </div>
      <div className={'calc-row'}>
        <button className={'fx-primary-button'} onClick={() => {
          const options = {
            number: allowNumber,
            letter: allowLetter,
            uppercaseLetter: allowUppercaseLetter,
            symbol: allowSymbol
          }
          const realLength = length < 2 ? 2 : (length > 64 ? 64 : length)
          const password = randomPassword(realLength, options)

          setPassword(password)
          const history = passwordHistory.slice(0, 15)
          history.splice(0, 0, password)
          setPasswordHistory(history)
        }}>点击生成
        </button>
      </div>
      <div>
        {renderPassword()}
      </div>
      <div>
        {renderHistory()}
      </div>
    </div>
  </div>
}
