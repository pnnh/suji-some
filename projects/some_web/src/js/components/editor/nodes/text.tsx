import SFNode, {SFNodeView} from "@/js/components/editor/nodes/node";
import {ReactEditor, useSlate} from "slate-react";
import {IconButton} from "@fluentui/react";
import {
    Editor,
    Element as SlateElement,
    Node as SlateNode,
    Path as SlatePath,
    Transforms
} from "slate";
import React, {CSSProperties} from "react";

export class SFTextNode extends SFNode {
    bold: boolean = false;
    italic: boolean = false;
    underline: boolean = false;

    constructor() {
        super("text");
    }
}

export function SFTextToolbar() {
    return <>
        <SFIcon iconName={"Bold"} format={"bold"} />
        <SFIcon iconName={"Italic"} format={"italic"} />
        <SFIcon iconName={"Underline"} format={"underline"} />
    </>
}

export function SFTextView(props: {attributes: any, children: any, node: SFTextNode}) {
    let style: CSSProperties = {}
    if (props.node.bold) {
        style.fontWeight = "bold";
    }
    if (props.node.italic) {
        style.fontStyle = "italic";
    }
    if (props.node.underline) {
        style.textDecoration = "underline";
    }
    return <span {...props.attributes} style={style}>{props.children}</span>
}

function SFIcon(props: {iconName: string, format: string}) {
    const editor = useSlate() as ReactEditor;
    return <IconButton iconProps={{iconName: props.iconName}} title="加粗"
                checked={isMarkActive(editor, props.format)}
                onMouseDown={(event) => {
                    event.preventDefault();
                    toggleMark(editor, props.format);
                }}/>
}

function toggleMark(editor: ReactEditor, format: string) {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true);
    }
}

function isMarkActive(editor: ReactEditor, format: string) {
    const marks = Editor.marks(editor) as SFTextNode;
    if (!marks) {
        return false;
    }
    switch(format) {
        case 'bold':
            return marks.bold;
        case 'italic':
            return marks.italic;
        case 'underline':
            return marks.underline;
    }
    return false;
}
