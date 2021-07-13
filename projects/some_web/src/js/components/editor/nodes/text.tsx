
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

export const TextName = "text";

export function SFTextToolbar() {
    return <>
        <SFIcon iconName={"Bold"} format={"bold"} />
        <SFIcon iconName={"Italic"} format={"italic"} />
        <SFIcon iconName={"Underline"} format={"underline"} />
        <SFIcon iconName={"Strikethrough"} format={"strike"} />
    </>
}

export function SFTextView(props: {attributes: any, children: any, node: any}) {
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
            case 'strike':
                style.textDecoration = "line-through";
                break;
        }
    }
    return <span {...props.attributes} style={style}>{props.children}</span>
}

function SFIcon(props: {iconName: string, format: string}) {
    const editor = useSlate() as ReactEditor;
    const isActive = (marks: any): boolean => {
        if (!marks || marks.name != TextName) {
            return false;
        }
        for(let key in marks) {
            if (!marks.hasOwnProperty(key)) {
                continue;
            }
            if (key == props.format && typeof marks[key] == "boolean") {
                return Boolean(marks[key]);
            }
        }
        return false;
    }
    return <IconButton iconProps={{iconName: props.iconName}}
                checked={isMarkActive(editor, isActive)}
                onMouseDown={(event) => {
                    event.preventDefault();
                    toggleMark(editor, props.format, true, isActive);
                }}/>
}
