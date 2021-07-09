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
import {
    SFHeaderNode,
    SFHeaderToolbar,
    SFHeaderView,
} from "@/js/components/editor/nodes/header";
import {SFTextNode, SFTextToolbar, SFTextView} from "@/js/components/editor/nodes/text";

interface SFEditorProps {
    onChange: (nodes: SlateDescendant[]) => void
    readOnly?: boolean,
}

interface SFEditorState {
    value: SlateDescendant[]
    readOnly: boolean
}
const initialValue = {
    name: 'paragraph',
    children: [{name: 'text', text: '', }],
};
class SFXEditor extends React.Component<SFEditorProps, SFEditorState> {
    editor = withHistory(withReact(createEditor() as ReactEditor))

    constructor(props) {
        super(props);
        this.state = {
            value: [initialValue], readOnly: false,
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
                            <SFTextToolbar editor={this.editor}/>
                        </Stack.Item>
                    </Stack>

                    <Editable
                        renderElement={this.renderElement}
                        renderLeaf={this.renderLeaf}
                        placeholder="请输入段落"
                        className={'editable'}
                        style={{minHeight:16, paddingLeft: 16, paddingRight: 16, paddingTop:8,
                            paddingBottom: 8}}
                    />
                </Slate>
        )
    }

    renderElement({ attributes, children, element }) {
        console.debug("renderElement", element, attributes, children);
        if (element.name === "header") {
            return <SFHeaderView attributes={attributes} children={children} node={element as SFHeaderNode} />
        }
        return <p style={{marginTop:0, marginBottom:0, minHeight:16 }} {...attributes}>{children}</p>
    }

    renderLeaf({ attributes, children, leaf }) {
        console.debug("renderLeaf", leaf, attributes, children);
        if (leaf.name === "text") {
            return <SFTextView attributes={attributes} children={children} node={leaf as SFTextNode}/>
        }
        return <span {...attributes}>{children}</span>
    }
}

export default SFXEditor
