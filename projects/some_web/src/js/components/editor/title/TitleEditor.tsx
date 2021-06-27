import React, {MouseEventHandler, ReactNode, useCallback, useMemo, useState} from 'react'
import isHotkey from 'is-hotkey'
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

import {css} from "@emotion/css";
import SFXNode from "@/js/components/editor/models";
import {IconButton, Stack} from "@fluentui/react";

interface SFEditorProps {
    value: SlateDescendant[],
    onChange: (nodes: SlateDescendant[]) => void
    readOnly?: boolean,
    toolextra: JSX.Element
}

interface SFEditorState {
    value: SlateDescendant[]
    readOnly: boolean
    active: boolean
}

class SFXTitleEditor extends React.Component<SFEditorProps, SFEditorState> {
    editor = withHistory(withReact(createEditor() as ReactEditor))

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            readOnly: this.props.readOnly ?? false,
            active: false,
        }
    }
    onChange = (value) => {
        this.setState({value: value})
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    }
    render() {
        return (
            <div onMouseEnter={()=>{
                this.setState({active: true})
            }}
                 onMouseLeave={()=>{
                     this.setState({active: false})
                 }}>
                <Slate editor={this.editor} value={this.state.value}
                       onChange={this.onChange}>
                    <Stack horizontal  horizontalAlign="space-between"
                           style={{visibility: this.state.active ? 'visible' : 'hidden'}}>
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
                        </Stack.Item>
                        <Stack.Item>
                            {this.props.toolextra}
                        </Stack.Item>
                    </Stack>
                    <Editable
                        renderElement={Element}
                        renderLeaf={Leaf}
                        placeholder="请输入标题"
                        readOnly={this.state.readOnly}
                        className={'editable'}
                        style={{minHeight:16, paddingLeft: 16, paddingRight: 16, paddingTop:8,
                            paddingBottom: 8}}
                    />
                </Slate>
            </div>
        )
    }
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
        default:
            return <span {...attributes}>{children}</span>
    }
}

const Leaf = ({ attributes, children, leaf }) => {
    return <span {...attributes}>{children}</span>
}

class SFXTitleOne implements SlateElement {
    type: string;
    children: SlateDescendant[] = [];
    constructor(type: string) {
        this.type = type;
    }
}

const toggleBlock = (editor: Editor, format: string) => {
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


export default SFXTitleEditor
