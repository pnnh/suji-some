import React, { useCallback, useMemo, useState } from 'react'
import {Editable, withReact, useSlate, Slate, ReactEditor, } from 'slate-react'
import {
    Editor,
    Transforms,
    createEditor,
    Path as SlatePath,
    Node as SlateNode,
    Descendant as SlateDescendant,
    Element as SlateElement, BaseElement, ExtendedType, BaseEditor,
} from 'slate'
import { withHistory } from 'slate-history'

import {IconButton, IContextualMenuProps,Stack} from "@fluentui/react";
import {
    SFHeaderNode,
    SFHeaderToolbar,
    SFHeaderView,
} from "@/js/components/editor/nodes/header";
import {SFTextNode, SFTextToolbar, SFTextView} from "@/js/components/editor/nodes/text";


const initialValue = [{
    name: 'paragraph',
    children: [{name: 'text', text: '', }],
}];
function SFXEditor() {
    console.debug("SFXEditor constructor")
    const [value, setValue] = useState<SlateDescendant[]>(initialValue)
    const renElement = useCallback(props => renderElement(props), [])
    const renLeaf = useCallback(props => renderLeaf(props), [])
    const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), [])

    return (
            <Slate editor={ editor} value={ value}
                   onChange={value => setValue(value)}>
                <Stack horizontal  horizontalAlign="space-between">
                    <Stack.Item>
                        <SFHeaderToolbar editor={editor} header={1}/>
                        <SFHeaderToolbar editor={editor} header={2}/>
                        <SFHeaderToolbar editor={editor} header={3}/>
                        <SFHeaderToolbar editor={editor} header={4}/>
                        <SFTextToolbar editor={editor}/>
                    </Stack.Item>
                </Stack>

                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="请输入段落"
                    className={'editable'}
                    autoFocus={true}
                    readOnly={false}
                    style={{minHeight:16, paddingLeft: 16, paddingRight: 16, paddingTop:8,
                        paddingBottom: 8}}
                />
            </Slate>
    )
}

function renderElement({ attributes, children, element }:{attributes: any, children: any, element: any}) {
    console.debug("renderElement", element, attributes, children);
    if (element.name === "header") {
        return <SFHeaderView attributes={attributes} children={children} node={element as SFHeaderNode} />
        //return <h1 {...attributes} >{children}</h1>
    }
    return <span style={{marginTop:0, marginBottom:0, minHeight:16 }} {...attributes}>{children}</span>
}

function renderLeaf({ attributes, children, leaf }:{attributes: any, children: any, leaf: any}) {
    console.debug("renderLeaf", leaf, attributes, children);
    if (leaf.name === "text") {
        return <SFTextView attributes={attributes} children={children} node={leaf as SFTextNode}/>
    }
    return <span {...attributes}>{children}</span>
}

export default SFXEditor
