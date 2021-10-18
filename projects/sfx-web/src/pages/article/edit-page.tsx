import React, { useEffect, useState } from 'react'
import { Stack } from '@fluentui/react'
import { SFXEditor, SFEditorModel } from '@pnnh/stele'
import { getJsonData, updateTitle } from '@/utils/helpers'
import { onEdit } from '@/pages/article/save'

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

const EditPage = (props:{match: { params: { pk: string } }}, state: NewPageState) => {
  console.debug('EditPage')
  const [title, setTitle] = useState('')
  const [keywords, setKeywords] = useState('')
  const [description, setDescription] = useState('')
  const [editorValue, setEditorValue] = useState<SFEditorModel>(initialValue)

  useEffect(() => {
    const serverData = getJsonData<any>()
    console.debug('NewPage useEffect', serverData)
    setTitle(serverData.title)
    setEditorValue(serverData.body)
    setKeywords(serverData.keywords)
    setDescription(serverData.description)
    updateTitle(serverData.title)
  }, [])

  return <Stack horizontal className={'article-edit'} horizontalAlign={'space-between'} tokens={{ childrenGap: 16 }}>
            <Stack.Item grow={1}>
                <Stack tokens={{ childrenGap: 8 }}>
                    <Stack.Item>
                        <input placeholder={'标题'} value={title} className={'fx-text-field'}
                               size={64}
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
                        <input placeholder={'关键字'} title={'逗号分隔'} value={keywords}
                               className={'fx-text-field'} size={64}
                                   onChange={(event) => {
                                     setKeywords(event.target.value)
                                   }}/>
                    </Stack.Item>
                    <Stack.Item>
                        <button className={'fx-primary-button'} onClick={() => {
                          console.debug('onSave', editorValue)
                          console.debug('onSave2', JSON.stringify(editorValue))
                          onEdit(props.match.params.pk, editorValue, title, description, keywords)
                        }}>
                            发布
                        </button>
                    </Stack.Item>
                </Stack>
            </Stack.Item>
        </Stack>
}

export default EditPage
