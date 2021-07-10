import React, { useCallback, useMemo, useState } from 'react'
import isHotkey from 'is-hotkey'
import {Editable, withReact, useSlate, Slate, ReactEditor} from 'slate-react'
import {
    Editor,
    Transforms,
    createEditor,
    Descendant,
    Element as SlateElement, Node as SlateNode, Path as SlatePath,
} from 'slate'
import { withHistory } from 'slate-history'

import {SFHeaderNode, SFHeaderToolbar, SFHeaderView} from "@/js/components/editor/nodes/header";
import {SFTextNode, SFTextView} from "@/js/components/editor/nodes/text";
import {SFParagraphNode} from "@/js/components/editor/nodes/paragraph";
import {IconButton} from "@fluentui/react";

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

const RichTextExample = () => {
    const [value, setValue] = useState<Descendant[]>(initialValue)
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])

    return (
        <Slate editor={editor} value={value} onChange={value => setValue(value)}>
            <div>
                <BlockButton format="heading-one" icon="looks_one" />
                <SFHeaderToolbar2  format="heading-one"/>
            </div>
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Enter some rich text…"
                spellCheck
                autoFocus
            />
        </Slate>
    )
}

function toggleBlock(editor: ReactEditor, node: {name:string}) {
    console.debug("toggleBlock", node)
    let props: any = node;
    if (isBlockActive(editor, node)) {
        props = {name:"paragraph"};
    }
    Transforms.setNodes(editor, props);
}

function isBlockActive(editor: ReactEditor, headerNode: { name:string }): boolean {
    console.debug("isBlockActive", headerNode)
    const [match] = Editor.nodes(editor, {
        match: (n: string, p: SlatePath) => {
            console.debug("isBlockActive====", n)
            return !Editor.isEditor(n) && SlateElement.isElement(n) &&
                n.name === headerNode.name ;
        },
    })
    return !!match
}


function Element({ attributes, children, element }:{attributes: any, children: any, element: any}) {
    console.debug("renderElement", element, attributes, children);
    if (element.name === "heading-one") {
        //return <SFHeaderView attributes={attributes} children={children} node={element as SFHeaderNode} />
        return <h1 {...attributes} >{children}</h1>
    }
    return <span style={{marginTop:0, marginBottom:0, minHeight:16 }} {...attributes}>{children}</span>
}

function Leaf({ attributes, children, leaf }:{attributes: any, children: any, leaf: any}) {
    console.debug("renderLeaf", leaf, attributes, children);
    if (leaf.name === "text") {
        return <SFTextView attributes={attributes} children={children} node={leaf as SFTextNode}/>
    }
    return <span {...attributes}>{children}</span>
}


const BlockButton = ({ format, icon }) => {
    const editor = useSlate()
    return (
        <button
            //active={isBlockActive(editor, {name:format})}
            onMouseDown={event => {
                event.preventDefault()
                toggleBlock(editor, {name:format})
            }}
        >
            title_one
        </button>
    )
}

export function SFHeaderToolbar2({ format, icon }) {
    const editor = useSlate();
    return <button  onMouseDown={(event)=> {
                           event.preventDefault()
                           toggleBlock(editor, {name:format})
    } }>标题一</button>
}
const initialValue: Descendant[] = [
    {
        name: 'paragraph',
        children: [
            {
                text:
                    "Since it's rich text, you can do things like turn a selection of text ",
            },
        ],
    },
    {
        name: 'paragraph',
        children: [{ text: 'Try it out for yourself!' }],
    },
]

export default RichTextExample
