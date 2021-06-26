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
import SFXParagraphEditor from "@/js/components/editor/paragraph/ParagraphEditor";
import SFXTitleEditor from "@/js/components/editor/title/TitleEditor";

const useParagraphToolExtra = (onInsert: (value: SFXNode) => void) => {
    const menuProps: IContextualMenuProps = {
        items: [
            {
                key: 'title',
                text: '添加标题',
                iconProps: { iconName: 'Mail' }
            },
            {
                key: 'paragraph',
                text: '添加段落',
                iconProps: { iconName: 'Calendar' },
            },
        ],
        onItemClick: (event, item) => {
            console.debug('onItemClick', event, item)
            if (!item) {
                return;
            }
            if (item.key === 'paragraph') {
                const p =  {
                    type: 'paragraph',
                    children: [
                        { text: '' },
                    ],
                };
                onInsert(p)
            } else if (item.key === 'title') {
                const p =  {
                    type: 'title',
                    children: [
                        { text: '' },
                    ],
                };
                onInsert(p)
            }
        },
        directionalHintFixed: true,
    };
    return <>
        <IconButton
            menuProps={menuProps}
            iconProps={{ iconName: 'Add' }}
            text={'添加'}
            title="Emoji"
            ariaLabel="Emoji"
        />
        <IconButton
            iconProps={{ iconName: 'Remove' }}
            text={'删除'}
            onClick={(event)=>{
                console.debug('onclick3', event)
            }}
        />
    </>
}

const SFXRow = (props: {value: SFXNode, onInsert: (value: SFXNode) => void}) => {
    const toolExtra = useParagraphToolExtra(props.onInsert)
    let children = <SFXParagraphEditor value={[props.value]}
                                       toolextra={toolExtra}
                                       onChange={(value: SlateDescendant[]) => {
        console.debug('SFXParagraphEditor change', value)
    }}/>
    if (props.value.type === 'title') {
        children = <SFXTitleEditor value={[props.value]}
                                   toolextra={toolExtra}
                                   onChange={(value: SlateDescendant[]) => {
            console.debug('SFXParagraphEditor change', value)
        }}/>
    }
    console.debug('SFXRow', typeof(props.value))
    return <Stack tokens={{childrenGap: 8}}>
        <Stack.Item grow={10}>
            {children}
        </Stack.Item>
    </Stack>
}

export default SFXRow
