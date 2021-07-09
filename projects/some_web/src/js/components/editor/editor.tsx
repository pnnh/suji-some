import React, { useCallback, useMemo, useState } from 'react'

import { css } from '@emotion/css'
import {
    Stack
} from '@fluentui/react';
import {
    Descendant as SlateDescendant,
} from 'slate'
import SFXNode from "@/js/components/editor/models";
import SFXParagraphEditor from "@/js/components/editor/paragraph/ParagraphEditor";

const editorStyles = css`
  border: 1px solid #605e5c;margin-bottom: 16px;
  min-height: 300px;  
`

const editorBodyStyles = css`
  margin-bottom: 32px;  
`

const SFXEditor = (props: {value: SFXNode, readOnly?: boolean}) => {
    const [editorValue, setEditorValue] = useState<SFXNode>(props.value);

    return (
        <div className={editorStyles}>
            <div className={editorBodyStyles}>
                <Stack tokens={{padding: 16, childrenGap: 8}}>
                    <Stack.Item>
                        <Stack tokens={{childrenGap: 8}}>
                            <Stack.Item grow={10}>
                                <SFXParagraphEditor value={[props.value]}
                                                    onChange={(value: SlateDescendant[]) => {
                                                    }}/>
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                </Stack>
            </div>
        </div>
    )
};

export default SFXEditor
