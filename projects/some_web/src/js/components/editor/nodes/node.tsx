import React from "react";
import {
    Editor,
    Element as SlateElement,
    Text as SlateText,
    Node as SlateNode,
    Path as SlatePath,
    Transforms
} from "slate";

export interface SFElement extends SlateElement {
    name: string;
    children: SFDescendant[];
}

export interface SFText extends SlateText {
    name: string;
}

export declare type SFDescendant = SFElement | SFText;

export interface SFPlugin {
    renderToolbox(): JSX.Element
}
