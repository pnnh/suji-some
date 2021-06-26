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

interface SFEditorProps {
    value: SlateDescendant[],
    onChange: (nodes: SlateDescendant[]) => void
    readOnly?: boolean,
    toolextra: JSX.Element
}

interface SFEditorState {
    value: SlateDescendant[]
    readOnly: boolean
    active: boolean,
}

class SFXParagraphEditor extends React.Component<SFEditorProps, SFEditorState> {
    editor = withHistory(withReact(createEditor() as ReactEditor))

    constructor(props) {
        super(props);
        this.state = {
            value: props.value, active: false, readOnly: false,
        }
    }
    onChange = (value) => {
        this.setState({value: value})
        console.debug('onchange', value)
    }

    render() {
        return (
            <div onMouseEnter={()=>{
                console.debug('onMouseEnter',)
                this.setState({active: true})
            }}
            onMouseLeave={()=>{
                console.debug('onMouseLeave',)
                this.setState({active: false})
            }}>
                <Slate editor={this.editor} value={this.state.value}
                       onChange={this.onChange}>
                    <Stack horizontal  horizontalAlign="space-between"
                           style={{visibility: this.state.active ? 'visible' : 'hidden'}}>
                        <Stack.Item>
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
                        <Stack.Item>
                            {this.props.toolextra}
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
            </div>
        )
    }
}

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)
    console.debug('toggleMark', format, isActive)

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

const Element = ({ attributes, children, element }) => {
    console.debug('Element', attributes, children, element)
    return <p style={{marginTop:0, marginBottom:0, minHeight:16 }} {...attributes}>{children}</p>
}

const Leaf = ({ attributes, children, leaf }) => {
    console.debug('Leaf', leaf)
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

export default SFXParagraphEditor
