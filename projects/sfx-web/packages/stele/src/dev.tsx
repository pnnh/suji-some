import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { SFEditorModel } from './editor/nodes/node'
import { SFXEditor } from './editor/editor'

const initialValue = {
  children: [{
    name: 'paragraph',
    children: [{ name: 'text', text: '' }]
  }]
}

function DevApp () {
  const [editorValue, setEditorValue] = useState<SFEditorModel>(initialValue)
  return <SFXEditor value={editorValue} onChange={(value) => {
    console.debug('onChange222')
    setEditorValue(value)
  }} />
}

ReactDOM.render(<DevApp />, document.getElementById('root'))
