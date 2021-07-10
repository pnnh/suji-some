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
import React from "react";
import {SFParagraphNode} from "@/js/components/editor/nodes/paragraph";

export class SFHeaderNode extends SFNode {
    header: number;

    constructor(header: number) {
        super("header");
        this.header = header;
    }
}

export function SFHeaderToolbar() {
    return <>
        <HeaderIcon header={1} />
        <HeaderIcon header={2} />
        <HeaderIcon header={3} />
        <HeaderIcon header={4} />
    </>
}

function toggleBlock(editor: ReactEditor, header: number) {
    let props: any = new SFHeaderNode(header);
    if (isActive(editor, header)) {
        props = new SFParagraphNode();
    }
    Transforms.setNodes(editor, props);
}

function isActive(editor: ReactEditor, header: number): boolean {
    const [match] = Editor.nodes(editor, {
        match: (n: SlateNode, p: SlatePath) => {
            const node = n as SFHeaderNode;
            if (!node) {
                return false
            }
            return !Editor.isEditor(n) && SlateElement.isElement(n) &&
                node.name === "header" && node.header == header;
        },
    })
    return !!match
}

export function SFHeaderView(props: {attributes: any, children: any, node: SFHeaderNode}) {
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

function HeaderIcon(props: {header: number}) {
    const editor = useSlate() as ReactEditor;
    return <IconButton iconProps={{iconName: `Header${props.header}`}} title="加粗"
                       checked={isActive(editor, props.header)}
                       onMouseDown={(event) => {
                           event.preventDefault();
                           toggleBlock(editor, props.header);
                       }}/>
}
