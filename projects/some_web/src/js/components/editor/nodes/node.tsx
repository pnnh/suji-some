import React from "react";
import {
    Editor,
    Element as SlateElement,
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


export class SFMark<T> implements SlateElement {
    constructor(public name: string,
                public key: string,
                public value: T,
                public children: SlateDescendant[] = []) {}
    isActive(props: any): boolean {
        throw new Error("not Implemented");
    }
}
