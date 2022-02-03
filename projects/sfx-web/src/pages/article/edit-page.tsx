import React, {useState} from 'react'
import type {SFEditorModel} from '@pnnh/stele'
import {SFXEditor} from '@pnnh/stele'
import {getJsonData, updateTitle} from '@/utils/helpers'
import {isScreenDesktop, isScreenTablet} from '@/utils/media'
import {useParams} from 'react-router'
import {onEdit} from '@/pages/article/save'

type NewPageState = {
  title: string;
  email: string;
  saveErrorMsg?: string;
};

const EditPage = (props: {}, state: NewPageState) => {
  console.debug('EditPage')
  const serverData = getJsonData<any>()
  const [title, setTitle] = useState(serverData.title)
  const [keywords, setKeywords] = useState(serverData.keywords)
  const [description, setDescription] = useState(serverData.description)
  const [editorValue, setEditorValue] = useState<SFEditorModel>(serverData.body)
  updateTitle(serverData.title)

  if (!isScreenDesktop() && !isScreenTablet()) {
    return <div>当前为移动设备，请使用电脑编辑</div>
  }
  const params = useParams() as { pk: string }
  console.debug('params', params)

  if (!params.pk) {
    return <div>参数有误</div>
  }
  return <div className={'article-edit-page'}>
    <div className={'article-edit'}>
      <div className={'title-area'}>
        <div>
          <input placeholder={'标题'} value={title} className={'fx-text-field'}
                 size={64}
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
          <input placeholder={'关键字'} title={'逗号分隔'} value={keywords}
                 className={'fx-text-field'} size={64}
                 onChange={(event) => {
                   setKeywords(event.target.value)
                 }}/>
        </div>
        <div>
          <button className={'fx-primary-button'} onClick={() => {
            console.debug('onSave', editorValue)
            console.debug('onSave2', JSON.stringify(editorValue))

            onEdit(params.pk, editorValue, title, description, keywords)
          }}>
            发布
          </button>
        </div>
      </div>
    </div>
  </div>
}

export default EditPage
