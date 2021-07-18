
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
import {SFText} from "@/js/components/editor/nodes/node";

export const TextName = "text";

export function NewTextNode(text: string): SFText {
    return {name: TextName, text: text}
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
    return <span data-name={TextName} {...props.attributes} style={style}>{props.children}</span>
}

