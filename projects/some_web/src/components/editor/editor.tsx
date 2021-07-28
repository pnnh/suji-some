import React, {ClipboardEvent, useCallback, useMemo, useState} from 'react';
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
import {IconButton, IContextualMenuProps,Stack} from "@fluentui/react";
import {
    HeaderName,
    SFHeaderNode,
    SFHeaderToolbar,
    SFHeaderView,
} from "@/components/editor/nodes/header";
import {NewTextNode, SFTextView} from "@/components/editor/nodes/text";
import {
    NewParagraphNode,
    SFParagraphNode,
    SFParagraphToolbar,
    SFParagraphView
} from "@/components/editor/nodes/paragraph";
import {
    CodeBlockName, NewCodeNode,
    SFCodeBlockLeafView,
    SFCodeBlockNode,
    SFCodeBlockToolbar,
    SFCodeBlockView
} from "@/components/editor/nodes/codeblock";
import Prism from "prismjs";
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-java'
import {SFToolbox} from "@/components/editor/toolbox";
import {
    parseDescendant,
    parseDescendantArray, parseElement,
    parseText,
    SFDescendant,
    SFEditor, SFText
} from "@/components/editor/nodes/node";

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

// 这里是单例的，一个页面只能有一个Editor
let editorObject: ReactEditor;
//let rootNode: {children: SFDescendant[]} = {children: []}

function SFXEditor(props: { value: SFEditor, onChange: (value: SFEditor) => void }) {
    console.debug("SFXEditor create");
    //const [value, setValue] = useState<SlateDescendant[]>(initialValue)
    const renElement = useCallback(props => <Element {...props}/>, [])
    const renLeaf = useCallback(props => <Leaf {...props}/>, []);
    const editorNode = withHistory(withReact(createEditor() as ReactEditor));
    editorObject = useMemo(() => editorNode, []);
    const decorate = useCallback(decorateElement, []);
    return (
            <Slate editor={editorObject} value={props.value.children}
                   onChange={value => {
                       console.log("onChange", value);
                       const editorValue = {
                           children: parseDescendantArray(value)
                       };
                       props.onChange(editorValue);
                       //rootNode = {children: descendants};
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
                                <SFCodeBlockToolbar/>
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
                                        // for (const hotkey in HOTKEYS) {
                                        //     if (isHotkey(hotkey, event as any)) {
                                        //         event.preventDefault()
                                        //         // const mark = HOTKEYS[hotkey]
                                        //         // toggleMark(editor, mark)
                                        //     }
                                        // }
                                        console.debug("event", event);
                                        if (event.key !== 'Enter') {
                                            return;
                                        }
                                        console.debug("selection", editorObject.selection);
                                        const selection = editorObject.selection;
                                        if (!selection) {
                                            return;
                                        }
                                        console.debug("anchor", selection.anchor);
                                        const selectedElement = SlateNode.descendant(editorObject, selection.anchor.path.slice(0, -1));
                                        console.debug("selectedElement", selectedElement);
                                        const selectedLeaf = SlateNode.descendant(editorObject, selection.anchor.path);
                                        console.debug("selectedLeaf", selectedLeaf);
                                        const element = parseDescendant(selectedElement);
                                        const leaf = parseText(selectedLeaf);
                                        if (element.name === HeaderName) {
                                            event.preventDefault();
                                            if (leaf.text.length === selection.anchor.offset) {
                                                // Transforms.insertNodes(editor, {
                                                //     type: 'paragraph',
                                                //     children: [{text: '', marks: []}],
                                                // });
                                                console.debug("selectedLeaf2");
                                                Transforms.insertNodes(editorObject, NewParagraphNode(""));
                                            }
                                            // else {
                                            //     Transforms.splitNodes(editor);
                                            //     Transforms.setNodes(editor, {type: 'paragraph'});
                                            // }
                                        } else if(element.name == CodeBlockName) {
                                            event.preventDefault();
                                            console.debug("selectedLeaf3");
                                            Transforms.insertNodes(editorObject, NewCodeNode("\n"));
                                        }
                                    }}
                                    onPaste={onEditorPaste}
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

function onEditorPaste(event: ClipboardEvent<HTMLDivElement>) {
    console.debug("onEditorPaste", event.clipboardData.getData('text'));
    const clipText = event.clipboardData.getData('text');

    console.debug("onEditorPaste2", clipText);
    console.debug("selection", editorObject.selection);
    const selection = editorObject.selection;
    if (!selection || !clipText || clipText.length < 1) {
        return;
    }
    console.debug("anchor", selection.anchor);
    const selectedElement = SlateNode.descendant(editorObject, selection.anchor.path.slice(0, -1));
    console.debug("selectedElement", selectedElement);
    const selectedLeaf = SlateNode.descendant(editorObject, selection.anchor.path);
    console.debug("selectedLeaf", selectedLeaf);
    const element = parseElement(selectedElement);
    const leaf = parseText(selectedLeaf);
    if (element.name === HeaderName) {
        event.preventDefault();
        if (leaf.text.length > 128) {
            console.debug("标题过长");
            return;     // 标题过长
        }
        let text = clipText.replaceAll("\n", "");

        console.debug("onEditorPaste selectedLeaf2", text == leaf.text, text, "|", leaf.text, "|");
        const textNode: SFText = NewTextNode(text);
        console.debug("onEditorPaste selectedLeaf3", textNode);
        Transforms.insertNodes(editorObject, textNode);
        // else {
        //     Transforms.splitNodes(editor);
        //     Transforms.setNodes(editor, {type: 'paragraph'});
        // }
    } else if(element.name == CodeBlockName) {
        event.preventDefault();
        let text = clipText;
        console.debug("onEditorPaste selectedLeaf3", text == leaf.text, text, "|", leaf.text, "|");
        const codeNode: SFText = NewCodeNode(text);
        console.debug("onEditorPaste selectedLeaf4", codeNode);
        Transforms.insertNodes(editorObject, codeNode);
    }
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
    console.debug("decorateElement parent1", editorObject);
    if (editorObject.children.length < 1) {
        return ranges;
    }
    const parentNode = SlateNode.parent(editorObject, path) as SFCodeBlockNode;
    console.debug("decorateElement parent", parentNode);

    if (!parentNode || parentNode.name != CodeBlockName) {
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
    } else if (element.name === "code-block") {
        return <SFCodeBlockView attributes={attributes} children={children} node={element}/>
    }
    return <SFParagraphView attributes={attributes} children={children} node={element as SFParagraphNode}/>
}

function Leaf({ attributes, children, leaf }:{attributes: any, children: any, leaf: any}) {
    console.debug("renderLeaf", leaf, attributes, children);
    if (leaf.name === "text") {
        return <SFTextView attributes={attributes} children={children} node={leaf}/>
    } else if(leaf.name == "code") {
        return <SFCodeBlockLeafView attributes={attributes} children={children} node={leaf}/>
    }
    return <span {...attributes}>{children}</span>
}

export default SFXEditor
