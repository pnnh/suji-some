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
import isHotkey from 'is-hotkey'
import {IconButton, IContextualMenuProps,Stack} from "@fluentui/react";
import {
    SFHeaderNode,
    SFHeaderToolbar,
    SFHeaderView,
} from "@/js/components/editor/nodes/header";
import {SFTextMark, SFTextToolbar, SFTextView} from "@/js/components/editor/nodes/text";
import {
    SFParagraphNode,
    SFParagraphToolbar,
    SFParagraphView
} from "@/js/components/editor/nodes/paragraph";


const initialValue = [{
    name: 'paragraph',
    children: [{name: 'text', text: '', }],
}];

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

function SFXEditor() {
    //console.debug("SFXEditor constructor")
    const [value, setValue] = useState<SlateDescendant[]>(initialValue)
    const renElement = useCallback(props => <Element {...props}/>, [])
    const renLeaf = useCallback(props => <Leaf {...props}/>, [])
    const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), [])

    return (
            <Slate editor={ editor} value={ value}
                   onChange={value => setValue(value)}>
                <Stack horizontal >
                    <Stack.Item>
                        <SFParagraphToolbar/>
                    </Stack.Item>
                    <Stack.Item>
                        <SFHeaderToolbar />
                    </Stack.Item>
                    <Stack.Item>
                        <SFTextToolbar />
                    </Stack.Item>
                </Stack>
                <Editable
                    renderElement={renElement}
                    renderLeaf={renLeaf}
                    placeholder="请输入段落"
                    className={'editable'}
                    autoFocus={true}
                    readOnly={false}
                    onKeyDown={event => {
                        for (const hotkey in HOTKEYS) {
                            if (isHotkey(hotkey, event as any)) {
                                event.preventDefault()
                                // const mark = HOTKEYS[hotkey]
                                // toggleMark(editor, mark)
                            }
                        }
                    }}
                />
            </Slate>
    )
}

function Element({ attributes, children, element }:{attributes: any, children: any, element: any}) {
    //console.debug("renderElement", element, attributes, children);
    if (element.name === "header") {
        return <SFHeaderView attributes={attributes} children={children} node={element as SFHeaderNode} />
    }
    return <SFParagraphView attributes={attributes} children={children} node={element as SFParagraphNode}/>
}

function Leaf({ attributes, children, leaf }:{attributes: any, children: any, leaf: any}) {
    //console.debug("renderLeaf", leaf, attributes, children);
    if (leaf.name === "text") {
        return <SFTextView attributes={attributes} children={children} node={leaf as SFTextMark}/>
    }
    return <span {...attributes}>{children}</span>
}

export default SFXEditor
