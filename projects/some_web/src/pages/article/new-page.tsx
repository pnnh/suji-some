import React, { useEffect, useState } from 'react'
import { PrimaryButton, Stack } from '@fluentui/react'
// import SFXEditor from 'stele/dist/types/editor/editor'
// import { SFXEditor, App3, App4, App5, App6, App7 } from 'stele'
import { SFXEditor, SFEditorModel } from 'stele'
import { updateTitle } from '@/utils/helpers'
import { css } from '@emotion/css'
import { onCreate } from '@/pages/article/partial/save'

// const a: string = App3()
// const b: string = App4()
// const c: string = <App5/>
// const d: string = <App6/>
// const d: string = <App7/>

type NewPageState = {
    title: string;
    email: string;
    saveErrorMsg?: string;
};

const initialValue = {
  children: [{
    name: 'paragraph',
    children: [{ name: 'text', text: '' }]
  }]
}

const inputStyles = css`
  border: 1px solid #edebe9;
  padding: 8px;outline: none;
`

const descriptionStyles = css`
  margin-bottom: 16px;
`

const NewPage = (props:{}, state: NewPageState) => {
  console.debug('NewPage')
  const [title, setTitle] = useState('')
  const [keywords, setKeywords] = useState('')
  const [description, setDescription] = useState('')
  const [editorValue, setEditorValue] = useState<SFEditorModel>(initialValue)

  useEffect(() => {
    updateTitle('创作')
  }, [])

  return <Stack tokens={{ childrenGap: 8 }}>
        <Stack.Item>
            <input placeholder={'标题'} value={title} className={inputStyles} size={64}
                       onChange={(event) => {
                         setTitle(event.target.value)
                       }}/>
        </Stack.Item>
        <Stack.Item className={descriptionStyles}>
            <textarea placeholder={'描述'} value={description} className={inputStyles}
                      cols={80} rows={4}
                       onChange={(event) => {
                         setDescription(event.target.value)
                       }}/>
        </Stack.Item>
        <Stack.Item>
            <SFXEditor value={editorValue} onChange={(value) => {
              console.debug('onChange222')
              setEditorValue(value)
            }} />
        </Stack.Item>
        <Stack.Item className={descriptionStyles}>
            <input placeholder={'关键字'} title={'逗号分隔'} size={64}
                   className={inputStyles} value={keywords}
                       onChange={(event) => {
                         setKeywords(event.target.value)
                       }}/>
        </Stack.Item>
        <Stack.Item>
            <PrimaryButton onClick={() => {
              onCreate(editorValue, title, description, keywords)
            }}>
                发布
            </PrimaryButton>
        </Stack.Item>
    </Stack>
}

export default NewPage
