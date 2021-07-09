import {
    Editor,
    Element as SlateElement,
    Node as SlateNode,
    Path as SlatePath,
    Transforms
} from "slate";
import {Descendant as SlateDescendant} from "slate/dist/interfaces/node";
import {ReactEditor} from "slate-react";
import {IconButton} from "@fluentui/react";
import React from "react";

export default class SFNode implements SlateElement {
    name: string;
    children: SlateDescendant[] = [];
    constructor(name: string) {
        this.name = name;
    }
}


export class SFNodeView<T> extends React.Component<T> {
    editor: ReactEditor;
    constructor(props) {
        super(props);
        this.editor = props.editor;
    }
}
