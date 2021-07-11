import SFProp, {SFMark} from "@/js/components/editor/nodes/node";
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
import {isMarkActive, toggleMark} from "@/js/components/editor/nodes/paragraph";

export class SFTextMark extends SFMark<boolean> {
    constructor(format: string) {
        super("text", format, true);
    }
    isActive(marks: any): boolean {
        if (!marks || marks.name != this.name) {
            return false;
        }
        for(let key in marks) {
            if (!marks.hasOwnProperty(key)) {
                continue;
            }
            if (key == this.key && typeof marks[key] == "boolean") {
                return Boolean(marks[key]);
            }
        }
        return false;
    }
}

export function SFTextToolbar() {
    return <>
        <SFIcon iconName={"Bold"} format={"bold"} />
        <SFIcon iconName={"Italic"} format={"italic"} />
        <SFIcon iconName={"Underline"} format={"underline"} />
    </>
}

export function SFTextView(props: {attributes: any, children: any, node: SFTextMark}) {
    let style: CSSProperties = {}

    for(let key in props.node) {
        if (!props.node.hasOwnProperty(key)) {
            continue;
        }
        switch(key) {
            case 'bold':
                style.fontWeight = "bold";
                break;
            case 'italic':
                style.fontStyle = "italic";
                break;
            case 'underline':
                style.textDecoration = "underline";
                break;
        }
    }
    return <span {...props.attributes} style={style}>{props.children}</span>
}

function SFIcon(props: {iconName: string, format: string}) {
    const editor = useSlate() as ReactEditor;
    let mark: SFMark<boolean> = new SFTextMark(props.format);
    return <IconButton iconProps={{iconName: props.iconName}} title="加粗"
                checked={isMarkActive(editor, mark)}
                onMouseDown={(event) => {
                    event.preventDefault();
                    toggleMark(editor, mark);
                }}/>
}
