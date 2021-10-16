import React, { useState } from 'react'
import {
  Stack,
  mergeStyleSets,
  Checkbox,
  SpinButton
} from '@fluentui/react'
import { randomPassword } from '@/utils/rand'

const classNames = mergeStyleSets({
  passwordItem: {
    color: '#000',
    marginBottom: '16px'
  },
  passwordStyle: {
    fontSize: '20px'
  },
  titleStyle: {
    marginTop: 0
  }
})
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
            <div className={classNames.passwordStyle} title={'长度' + String(password.length)}>{password}</div>
        </>
  }
  const renderHistory = () => {
    if (passwordHistory.length < 1) {
      return <span></span>
    }
    const historyList = passwordHistory.map(pwd => {
      return <div key={pwd} title={'长度' + String(pwd.length)} className={classNames.passwordItem}>
                {pwd}
            </div>
    })
    return <>
            <h2>历史密码</h2>
            {historyList}
        </>
  }
  return <Stack tokens={{ childrenGap: 16 }}>
            <Stack.Item>
                <h2 className={classNames.titleStyle}>随机密码生成器</h2>
            </Stack.Item>
            <Stack.Item>
                <Stack horizontal tokens={{ childrenGap: 16 }}>
                    <Checkbox label="小写字母" title={'a-z'} checked={allowLetter} onChange={(event, isChecked) => {
                      setAllowLetter(isChecked || false)
                    }} />
                    <Checkbox label="大写字母" title={'A-Z'} checked={allowUppercaseLetter} onChange={(event, isChecked) => {
                      setAllowUppercaseLetter(isChecked || false)
                    }} />
                    <Checkbox label="数字" title={'0-9'} checked={allowNumber} onChange={(event, isChecked) => {
                      setAllowNumber(isChecked || false)
                    }} />
                    <Checkbox label="特殊符号" title={'@#$...'} checked={allowSymbol} onChange={(event, isChecked) => {
                      setAllowSymbol(isChecked || false)
                    }} />
                </Stack>
            </Stack.Item>
            <Stack.Item>
                <SpinButton
                    value={length.toString()}
                    onChange={(event, value) => {
                      setLength(Number(value))
                    }}
                    title={'密码长度'}
                    min={4} max={64} step={2}
                    styles={{ spinButtonWrapper: { width: 75 } }}
                />
            </Stack.Item>
            <Stack.Item align={'start'}>
                <button className={'fx-primary-button'} onClick={() => {
                  const options = {
                    number: allowNumber,
                    letter: allowLetter,
                    uppercaseLetter: allowUppercaseLetter,
                    symbol: allowSymbol
                  }
                  const password = randomPassword(length, options)

                  setPassword(password)
                  const history = passwordHistory.slice(0, 15)
                  history.splice(0, 0, password)
                  setPasswordHistory(history)
                }}>点击生成</button>
            </Stack.Item>
            <Stack.Item>
                {renderPassword()}
            </Stack.Item>
            <Stack.Item>
                {renderHistory()}
            </Stack.Item>
        </Stack>
}