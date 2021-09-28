import React, { useEffect, useState } from 'react'
import { TextField } from '@fluentui/react/lib/TextField'
import { PrimaryButton, Stack } from '@fluentui/react'
import SFXEditor from '@/components/editor/editor'
import { SFEditor } from '@/components/editor/nodes/node'
import { updateTitle } from '@/utils/helpers'
import { css } from '@emotion/css'
import { onCreate } from '@/pages/article/partial/save'

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

const descriptionStyles = css`
  margin-bottom: 16px;
`

const NewPage = (props:{}, state: NewPageState) => {
  console.debug('NewPage')
  const [title, setTitle] = useState('')
  const [keywords, setKeywords] = useState('')
  const [description, setDescription] = useState('')
  const [editorValue, setEditorValue] = useState<SFEditor>(initialValue)

  useEffect(() => {
    updateTitle('创作')
  }, [])

  return <Stack tokens={{ childrenGap: 8 }}>
        <Stack.Item>
            <TextField placeholder={'标题'} value={title}
                       onChange={(event, value) => {
                         if (!value) {
                           return
                         }
                         setTitle(value)
                       }}/>
        </Stack.Item>
        <Stack.Item className={descriptionStyles}>
            <TextField placeholder={'描述'} multiline={true} value={description}
                       onChange={(event, value) => {
                         if (!value) {
                           return
                         }
                         setDescription(value)
                       }}/>
        </Stack.Item>
        <Stack.Item>
            <SFXEditor value={editorValue} onChange={(value) => {
              console.debug('onChange222')
              setEditorValue(value)
            }} />
        </Stack.Item>
        <Stack.Item className={descriptionStyles}>
            <TextField placeholder={'关键字'} title={'逗号分隔'} value={keywords}
                       onChange={(event, value) => {
                         if (!value) {
                           return
                         }
                         setKeywords(value)
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
