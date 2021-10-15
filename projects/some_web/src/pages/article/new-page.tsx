import React, { useEffect, useState } from 'react'
import { Stack } from '@fluentui/react'
import { SFXEditor, SFEditorModel } from 'stele'
import { updateTitle } from '@/utils/helpers'
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

const NewPage = (props:{}, state: NewPageState) => {
  console.debug('NewPage')
  const [title, setTitle] = useState('')
  const [keywords, setKeywords] = useState('')
  const [description, setDescription] = useState('')
  const [editorValue, setEditorValue] = useState<SFEditorModel>(initialValue)

  useEffect(() => {
    updateTitle('创作')
  }, [])

  return <Stack tokens={{ childrenGap: 8 }} className={'article-edit'}>
        <Stack.Item>
            <input placeholder={'标题'} value={title} className={'fx-text-field'} size={64}
                       onChange={(event) => {
                         setTitle(event.target.value)
                       }}/>
        </Stack.Item>
        <Stack.Item className={'description'}>
            <textarea placeholder={'描述'} value={description} className={'fx-text-area'}
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
        <Stack.Item className={'description'}>
            <input placeholder={'关键字'} title={'逗号分隔'} size={64}
                   className={'fx-text-field'} value={keywords}
                       onChange={(event) => {
                         setKeywords(event.target.value)
                       }}/>
        </Stack.Item>
        <Stack.Item>
            <button className={'fx-primary-button'} onClick={() => {
              onCreate(editorValue, title, description, keywords)
            }}>
                发布
            </button>
        </Stack.Item>
    </Stack>
}

export default NewPage
