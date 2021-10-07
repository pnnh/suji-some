import React, { useState } from 'react'
import { PrimaryButton, Stack } from '@fluentui/react'
import { SFXEditor } from './editor/editor'
import { SFEditor } from './editor/nodes/node'

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

const App = (props:{}, state: NewPageState) => {
  const [editorValue, setEditorValue] = useState<SFEditor>(initialValue)

  return <Stack tokens={{ childrenGap: 8 }}>
    <Stack.Item>
      <SFXEditor value={editorValue} onChange={(value) => {
        console.debug('onChange222')
        setEditorValue(value)
      }} />
    </Stack.Item>
    <Stack.Item>
      <PrimaryButton>
        发布
      </PrimaryButton>
    </Stack.Item>
  </Stack>
}

export default App
