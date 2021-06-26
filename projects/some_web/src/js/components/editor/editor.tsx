import React, { useCallback, useMemo, useState } from 'react'

import { css } from '@emotion/css'
import {
    HighContrastSelector,
    IButtonStyles,
    IconButton,
    IContextualMenuProps,
    IIconProps,
    IStackItemStyles,
    IStackTokens,
    PrimaryButton,
    Stack
} from '@fluentui/react';
import {IStackStyles} from "@fluentui/react/lib/Stack";
import { FontIcon } from '@fluentui/react/lib/Icon';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import {
    Editor,
    Transforms,
    createEditor,
    Path as SlatePath,
    Node as SlateNode,
    Descendant as SlateDescendant,
    Element as SlateElement, BaseElement, ExtendedType, BaseEditor,
} from 'slate'
import SFXNode from "@/js/components/editor/models";
import SFXRow from "@/js/components/editor/row";

const editorStyles = css`
  border: 1px solid #605e5c;margin-bottom: 16px;
  min-height: 300px;  
`

const editorBodyStyles = css`
  margin-bottom: 32px;  
`

const SFXEditor = (props: {value: SFXNode[], readOnly?: boolean}) => {
    const [editorValue, setEditorValue] = useState<SFXNode[]>(props.value);

    const descendants = editorValue.map((d, k) => {
        return <Stack.Item key={k}>
            <SFXRow value={d} onInsert={(value) => {
                const newValue = editorValue.concat(value);
                console.debug('jjjjj', editorValue, newValue);
                setEditorValue(newValue);
            }}/>
        </Stack.Item>
    })
    console.debug('jj descendants', descendants)

    return (
        <div className={editorStyles}>
            <div className={editorBodyStyles}>
                <Stack tokens={{padding: 16, childrenGap: 8}}>
                    {descendants}
                </Stack>
            </div>
        </div>
    )
};

export default SFXEditor
