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

export class SFHeaderNode extends SFNode {
    header: number;

    constructor(header: number) {
        super("header");
        this.header = header;
    }
}

export class SFNodeView<T> extends React.Component<T> {
    editor: ReactEditor;
    constructor(props) {
        super(props);
        this.editor = props.editor;
    }
}

export class SFHeaderToolbar extends SFNodeView<{editor: ReactEditor, header: number}> {
    node: SFHeaderNode;
    constructor(props) {
        super(props);
        this.node = new SFHeaderNode(props.header);
    }
    render() {
        return <IconButton iconProps={{iconName: `Header${this.node.header}`}}
                           checked={this.isActive()}
                           onClick={()=> this.toggleBlock() }/>
    }
    toggleBlock() {
        let node: any = this.node;
        if (this.isActive()) {
            node = new SFParagraphNode();
        }
        Transforms.setNodes(this.editor, node);
    }
    isActive(): boolean {
        console.debug("isHeaderActive");
        const [match] = Editor.nodes(this.editor, {
            match: (n: SlateNode, p: SlatePath) => {
                const node = n as SFHeaderNode;
                if (!node) {
                    return false
                }
                return !Editor.isEditor(n) && SlateElement.isElement(n) &&
                    node.name === this.node.name && node.header == this.node.header;
            },
        })
        return !!match
    }
}


export function SFHeaderView(props: {attributes, children, node: SFHeaderNode}) {
    switch (props.node.header) {
        case 1:
            return <h1 {...props.attributes} >{props.children}</h1>
        case 2:
            return <h2{...props.attributes}>{props.children}</h2>
        case 3:
            return <h3{...props.attributes}>{props.children}</h3>
        case 4:
            return <h4{...props.attributes}>{props.children}</h4>
    }
    return <h1 {...props.attributes}>{props.children}</h1>
}

export class SFParagraphNode extends SFNode {
    constructor() {
        super("paragraph");
    }
}
