import React, { useCallback, useMemo, useState } from 'react'
import {Editable, withReact, useSlate, Slate, ReactEditor} from 'slate-react'
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
import SFXNode from "@/js/components/editor/models";
import {css} from "@emotion/css";

interface SFEditorProps {
    value: SlateDescendant[],
    onChange: (nodes: SlateDescendant[]) => void
    readOnly?: boolean,
}

interface SFEditorState {
    value: SlateDescendant[]
    readOnly: boolean
}

class SFXEditor extends React.Component<SFEditorProps, SFEditorState> {
    editor = withHistory(withReact(createEditor() as ReactEditor))

    constructor(props) {
        super(props);
        this.state = {
            value: props.value, readOnly: false,
        }
    }
    onChange = (value) => {
        console.debug("value", value);
        this.setState({value: value});
    }

    render() {
        return (
                <Slate editor={this.editor} value={this.state.value}
                       onChange={this.onChange}>
                    <Stack horizontal  horizontalAlign="space-between">
                        <Stack.Item>
                            <IconButton iconProps={{iconName: 'Header1'}} title="标题一"
                                        checked={isBlockActive(this.editor, "heading-one")}
                                        onClick={()=>{
                                            toggleBlock(this.editor, "heading-one")
                                        }}/>
                            <IconButton iconProps={{iconName: 'Header2'}} title="标题二"
                                        checked={isBlockActive(this.editor, "heading-two")}
                                        onClick={()=>{
                                            toggleBlock(this.editor, "heading-two")
                                        }}/>
                            <IconButton iconProps={{iconName: 'Header3'}} title="标题三"
                                        checked={isBlockActive(this.editor, "heading-three")}
                                        onClick={()=>{
                                            toggleBlock(this.editor, "heading-three")
                                        }}/>
                            <IconButton iconProps={{iconName: 'Header4'}} title="标题四"
                                        checked={isBlockActive(this.editor, "heading-four")}
                                        onClick={()=>{
                                            toggleBlock(this.editor, "heading-four")
                                        }}/>
                            <IconButton iconProps={{iconName: 'Bold'}} title="加粗"
                                        checked={isMarkActive(this.editor, "bold")}
                                        onClick={()=>{
                                            toggleMark(this.editor, "bold")
                                        }}/>
                            <IconButton iconProps={{iconName: 'Italic'}} title="斜体"
                                        checked={isMarkActive(this.editor, "italic")}
                                        onClick={()=>{
                                            toggleMark(this.editor, "italic")
                                        }}/>
                            <IconButton iconProps={{iconName: 'Underline'}} title="下划线"
                                        checked={isMarkActive(this.editor, "underline")}
                                        onClick={()=>{
                                            toggleMark(this.editor, "underline")
                                        }}/>
                            <IconButton iconProps={{iconName: 'Code'}} title="行内代码"
                                        checked={isMarkActive(this.editor, "code")}
                                        onClick={()=>{
                                            toggleMark(this.editor, "code")
                                        }}/>
                        </Stack.Item>
                    </Stack>

                    <Editable
                        renderElement={Element}
                        renderLeaf={Leaf}
                        placeholder="请输入段落"
                        className={'editable'}
                        style={{minHeight:16, paddingLeft: 16, paddingRight: 16, paddingTop:8,
                            paddingBottom: 8}}
                    />
                </Slate>
        )
    }
}

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}
class SFXTitleOne implements SlateElement {
    type: string;
    children: SlateDescendant[] = [];
    constructor(type: string) {
        this.type = type;
    }
}
const toggleBlock = (editor: Editor, format: string) => {
    const isActive = isBlockActive(editor, format)

    if (isActive) {
        format = "paragraph"
    }

    const newProperties2 = new SFXTitleOne(format);
    Transforms.setNodes(editor, newProperties2)
}

const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: (n: SlateNode, p: SlatePath) => {
            const node = n as SFXNode;
            if (!node) {
                return false
            }
            return !Editor.isEditor(n) && SlateElement.isElement(n) && node.type === format
        },
    })
    return !!match
}

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}
const titleStyles = css`
    margin: 0;
`
const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'heading-one':
            return <h1 {...attributes} className={titleStyles}>{children}</h1>
        case 'heading-two':
            return <h2{...attributes} className={titleStyles}>{children}</h2>
        case 'heading-three':
            return <h3{...attributes} className={titleStyles}>{children}</h3>
        case 'heading-four':
            return <h4{...attributes} className={titleStyles}>{children}</h4>
    }
    return <p style={{marginTop:0, marginBottom:0, minHeight:16 }} {...attributes}>{children}</p>
}

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}

export default SFXEditor
