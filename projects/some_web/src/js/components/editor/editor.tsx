import React, { useCallback, useMemo, useState } from 'react';
import {Editable, withReact, useSlate, Slate, ReactEditor, } from 'slate-react'
import {
    Editor,
    Transforms,
    createEditor,
    Path as SlatePath,
    Node as SlateNode,
    Range as SlateRange,
    Descendant as SlateDescendant,
    Element as SlateElement, BaseElement, ExtendedType, BaseEditor, Descendant, Text, NodeEntry,
} from 'slate'
import { withHistory } from 'slate-history'
import isHotkey from 'is-hotkey'
import {IconButton, IContextualMenuProps,Stack} from "@fluentui/react";
import {
    SFHeaderNode,
    SFHeaderToolbar,
    SFHeaderView,
} from "@/js/components/editor/nodes/header";
import { SFTextView} from "@/js/components/editor/nodes/text";
import {
    SFParagraphNode,
    SFParagraphToolbar,
    SFParagraphView
} from "@/js/components/editor/nodes/paragraph";
import {
    CodeblockName,
    SFCodeblockLeafView,
    SFCodeblockNode,
    SFCodeblockToolbar,
    SFCodeblockView
} from "@/js/components/editor/nodes/codeblock";
import Prism from "prismjs"
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-java'
import {SFToolbox} from "@/js/components/editor/toolbox";

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

//let editorValue: SlateDescendant[];
let editorNode: ReactEditor;
let rootNode: {children: SlateDescendant[]} = {children: []}


function SFXEditor(props: { value: SlateDescendant[], onChange: (value: SlateDescendant[]) => void }) {
    console.debug("SFXEditor create");
    //const [value, setValue] = useState<SlateDescendant[]>(initialValue)
    const renElement = useCallback(props => <Element {...props}/>, [])
    const renLeaf = useCallback(props => <Leaf {...props}/>, []);
    editorNode = withHistory(withReact(createEditor() as ReactEditor));
    const editor = useMemo(() => editorNode, []);
    const decorate = useCallback(decorateElement, []);
    return (
            <Slate editor={ editor} value={props.value}
                   onChange={value => {
                       console.log("onChange", value);
                       props.onChange(value);
                       rootNode = {children: value};
                   }}>

                <Stack tokens={{padding: 16, childrenGap: 8}}>
                    <Stack.Item>
                        <Stack horizontal >
                            <Stack.Item>
                                <SFParagraphToolbar/>
                            </Stack.Item>
                            <Stack.Item>
                                <SFHeaderToolbar />
                            </Stack.Item>
                            <Stack.Item>
                                <SFCodeblockToolbar/>
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                    <Stack.Item>
                        <Stack horizontal >
                            <Stack.Item grow={1}>
                                <Editable
                                    decorate={decorate}
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
                            </Stack.Item>
                            <Stack.Item styles={{root: {width: 200}}}>
                                <SFToolbox descendant={{name:"header",children:[]}} />
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                </Stack>
            </Slate>
    )
}

const getLength = (token: string | Prism.Token): number => {
    if (typeof token === 'string') {
        return token.length
    } else if (typeof token.content === 'string') {
        return token.content.length
    } else if (Array.isArray(token.content)) {
        console.debug("getLength", typeof token.content, token.content);
        return token.content.reduce((l, t) => l + getLength(t), 0);
    }
    throw new Error("未知token类型");
}

function decorateElement([node, path]: NodeEntry): SlateRange[] {
    console.debug("decorateElement", node, Text.isText(node));

    const ranges: SlateRange[] = [];
    if (!Text.isText(node)) {
        return ranges
    }
    //if (editorValue.length > 0) {
    console.debug("decorateElement parent1", rootNode);
    if (rootNode.children.length < 1) {
        return ranges;
    }
    const parentNode = SlateNode.parent(rootNode, path) as SFCodeblockNode;
    console.debug("decorateElement parent", parentNode);

    if (!parentNode || parentNode.name != CodeblockName) {
        return ranges;
    }
    //}
    const tokens = Prism.tokenize(node.text, Prism.languages[parentNode.language])
    let start = 0

    for (const token of tokens) {
        const length = getLength(token)
        const end = start + length

        if (typeof token !== 'string') {
            ranges.push({
                [token.type]: true,
                anchor: { path, offset: start },
                focus: { path, offset: end },
            })
        }

        start = end
    }

    return ranges
}

function Element({ attributes, children, element }:{attributes: any, children: any, element: any}) {
    console.debug("renderElement", element, attributes, children);
    if (element.name === "header") {
        return <SFHeaderView attributes={attributes} children={children} node={element as SFHeaderNode} />
    } else if (element.name === "codeblock") {
        return <SFCodeblockView attributes={attributes} children={children} node={element}/>
    }
    return <SFParagraphView attributes={attributes} children={children} node={element as SFParagraphNode}/>
}

function Leaf({ attributes, children, leaf }:{attributes: any, children: any, leaf: any}) {
    console.debug("renderLeaf", leaf, attributes, children);
    if (leaf.name === "text") {
        return <SFTextView attributes={attributes} children={children} node={leaf}/>
    } else if(leaf.name == "code") {
        return <SFCodeblockLeafView attributes={attributes} children={children} node={leaf}/>
    }
    return <span {...attributes}>{children}</span>
}

export default SFXEditor
