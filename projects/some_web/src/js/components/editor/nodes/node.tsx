import React from "react";
import {
    Editor,
    Element as SlateElement,
    Text as SlateText,
    Node as SlateNode,
    Path as SlatePath,
    Transforms
} from "slate";
import {Descendant as SlateDescendant} from "slate/dist/interfaces/node";

export default class SFProp implements SlateElement {
    constructor(public name: string,
                public children: SlateDescendant[] = []) {}
    isActive(props: any): boolean {
        throw new Error("not Implemented");
    }
}

export class SFMark<T> {
    constructor(public name: string,
                public key: string,
                public value: T) {}
    isActive(props: any): boolean {
        throw new Error("not Implemented");
    }
}

export interface SFElement extends SlateElement {
    name: string;
    children: SFDescendant[];
}

export interface SFText extends SlateText {
    name: string;
}

export declare type SFDescendant = SFElement | SFText;


export interface SFCode extends SlateText {
    name: string;
}
