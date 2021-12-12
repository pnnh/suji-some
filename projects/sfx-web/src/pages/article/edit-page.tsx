import React, { useEffect, useState } from 'react'
import { Stack } from '@fluentui/react'
import { SFXEditor, SFEditorModel } from '@pnnh/stele'
import { getJsonData, updateTitle } from '@/utils/helpers'
import { onEdit } from '@/pages/article/save'
import { isScreenDesktop } from '@/utils/media'
import { useParams } from 'react-router'

type NewPageState = {
  title: string;
  email: string;
  saveErrorMsg?: string;
};

const initialValue = {
  children: [{
    name: 'paragraph',
    children: [{ name: 'text', text: 'aaa' }]
  }]
}

const EditPage = (props: {}, state: NewPageState) => {
  console.debug('EditPage')
  const serverData = getJsonData<any>()
  const [title, setTitle] = useState(serverData.title)
  const [keywords, setKeywords] = useState(serverData.keywords)
  const [description, setDescription] = useState(serverData.description)
  const [editorValue, setEditorValue] = useState<SFEditorModel>(serverData.body)
  console.debug('NewPage useEffect3333333333')
  console.debug('NewPage useEffect', serverData)
  console.debug('NewPage useEffect=====\n', JSON.stringify(serverData.body))
  updateTitle(serverData.title)

  if (!isScreenDesktop()) {
    return <div>当前为移动设备，请使用电脑编辑</div>
  }
  const params = useParams() as { pk: string }
  console.debug('params', params)

  if (!params.pk) {
    return <div>参数有误</div>
  }
  return <div className={'article-edit-page'}>
    <div className={'article-edit'}>
    <Stack tokens={{ childrenGap: 8 }} className={'title-area'}>
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
    </Stack>
    <Stack tokens={{ childrenGap: 8 }} className={'body-area'}>
      <Stack.Item>
        <SFXEditor value={editorValue} onChange={(value) => {
          console.debug('onChange222')
          setEditorValue(value)
        }}/>
      </Stack.Item>
    </Stack>
    <Stack tokens={{ childrenGap: 8 }} className={'submit-area'}>
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

          onEdit(params.pk, editorValue, title, description, keywords)
        }}>
          发布
        </button>
      </Stack.Item>
    </Stack>
  </div>
  </div>
}

export default EditPage
