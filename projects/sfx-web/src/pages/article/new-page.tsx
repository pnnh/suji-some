import React, {useEffect, useState} from 'react'
import type {SFEditorModel} from '@pnnh/stele'
import {SFXEditor} from '@pnnh/stele'
import {updateTitle} from '@/utils/helpers'
import {onCreate} from '@/pages/article/save'
import {isScreenDesktop, isScreenTablet} from '@/utils/media'

type NewPageState = {
  title: string;
  email: string;
  saveErrorMsg?: string;
};

const initialValue = {
  children: [{
    name: 'paragraph',
    children: [{name: 'text', text: ''}]
  }]
}

const NewPage = (props: unknown, state: NewPageState) => {
  console.debug('NewPage')
  const [title, setTitle] = useState('')
  const [keywords, setKeywords] = useState('')
  const [description, setDescription] = useState('')
  const [editorValue, setEditorValue] = useState<SFEditorModel>(initialValue)

  useEffect(() => {
    updateTitle('创作')
  }, [])

  if (!isScreenDesktop() && !isScreenTablet()) {
    return <div>当前为移动设备，请使用电脑编辑</div>
  }

  return <div className={'article-edit-page'}>
    <div className={'article-edit'}>
      <div className={'title-area'}>
        <div>
          <input placeholder={'标题'} value={title} className={'fx-text-field'} size={64}
                 onChange={(event) => {
                   setTitle(event.target.value)
                 }}/>
        </div>
        <div className={'description'}>
            <textarea placeholder={'描述'} value={description} className={'fx-text-area'}
                      cols={80} rows={4}
                      onChange={(event) => {
                        setDescription(event.target.value)
                      }}/>
        </div>
      </div>
      <div className={'body-area'}>
        <div>
          <SFXEditor value={editorValue} onChange={(value) => {
            console.debug('onChange222')
            setEditorValue(value)
          }}/>
        </div>
      </div>
      <div className={'submit-area'}>
        <div className={'description'}>
          <input placeholder={'关键字'} title={'逗号分隔'} size={64}
                 className={'fx-text-field'} value={keywords}
                 onChange={(event) => {
                   setKeywords(event.target.value)
                 }}/>
        </div>
        <div>
          <button className={'fx-primary-button'} onClick={() => {
            onCreate(editorValue, title, description, keywords)
          }}>
            发布
          </button>
        </div>
      </div>
    </div>
  </div>
}

export default NewPage
