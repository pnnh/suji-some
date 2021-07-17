import React from "react";
import {
    Editor as SlateEditor,
    Element as SlateElement,
    Text as SlateText,
    Node as SlateNode,
    Path as SlatePath,
    Descendant as SlateDescendant,
    Transforms
} from "slate";

export interface SFEditor {
    children: SFDescendant[];
}

export interface SFElement extends SlateElement {
    name: string;
    children: SFDescendant[];
}

export interface SFText extends SlateText {
    name: string;
}

export declare type SFDescendant = SFElement | SFText;

export function parseDescendantArray(descendants: SlateDescendant[]): SFDescendant[] {
    return descendants.map(slateDescendant => {
        const d = slateDescendant as any;
        if (typeof d.name !== "string") {
            throw new Error("未知元素: " + d.name);
        }
        return d;
    })
}

export interface SFPlugin {
    renderToolbox(element: SFElement): JSX.Element
}


