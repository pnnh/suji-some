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
import {css} from "@emotion/css";
import SFNode, {SFHeaderNode, SFHeaderView, SFParagraphNode} from "@/js/components/editor/node";

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
                            <SFHeaderView editor={this.editor} header={1}/>
                            <SFHeaderView editor={this.editor} header={2}/>
                            <SFHeaderView editor={this.editor} header={3}/>
                            <SFHeaderView editor={this.editor} header={4}/>
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
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
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

const toggleBlock = (editor: Editor, node: SFNode) => {
    if (isBlockActive(editor, node.name)) {
        node = new SFParagraphNode();
    }
    console.debug("toggleBlock", node);
    Transforms.setNodes(editor, node);
}

const isBlockActive = (editor, format) => {
    console.debug("isBlockActive", format);
    const [match] = Editor.nodes(editor, {
        match: (n: SlateNode, p: SlatePath) => {
            const node = n as SFNode;
            if (!node) {
                return false
            }
            return !Editor.isEditor(n) && SlateElement.isElement(n) && node.name === format
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
const renderElement = ({ attributes, children, element }) => {
    console.debug("renderElement", element, attributes, children);
    if (element.name === "header") {
        switch (element.header) {
            case 1:
                return <h1 {...attributes} className={titleStyles}>{children}</h1>
            case 2:
                return <h2{...attributes} className={titleStyles}>{children}</h2>
            case 3:
                return <h3{...attributes} className={titleStyles}>{children}</h3>
            case 4:
                return <h4{...attributes} className={titleStyles}>{children}</h4>
        }
    }
    return <p style={{marginTop:0, marginBottom:0, minHeight:16 }} {...attributes}>{children}</p>
}

const renderLeaf = ({ attributes, children, leaf }) => {
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
