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
import SFNode, {
    SFHeaderNode,
    SFHeaderToolbar,
    SFHeaderView,
    SFParagraphNode
} from "@/js/components/editor/node";

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
                            <SFHeaderToolbar editor={this.editor} header={1}/>
                            <SFHeaderToolbar editor={this.editor} header={2}/>
                            <SFHeaderToolbar editor={this.editor} header={3}/>
                            <SFHeaderToolbar editor={this.editor} header={4}/>
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

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

const renderElement = ({ attributes, children, element }) => {
    console.debug("renderElement", element, attributes, children);
    if (element.name === "header") {
        return <SFHeaderView attributes={attributes} children={children} node={element as SFHeaderNode} />
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
