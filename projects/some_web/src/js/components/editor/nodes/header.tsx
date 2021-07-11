import SFProp from "@/js/components/editor/nodes/node";
import {ReactEditor, useSlate} from "slate-react";
import {
    Dropdown,
    DropdownMenuItemType,
    IconButton,
    IDropdownOption,
    IDropdownStyles,
    Stack
} from "@fluentui/react";
import {
    Editor,
    Element as SlateElement,
    Node as SlateNode,
    Path as SlatePath,
    Transforms
} from "slate";
import React, {CSSProperties} from "react";
import {isBlockActive, toggleBlock} from "@/js/components/editor/nodes/paragraph";

export class SFHeaderNode extends SFProp {
    constructor(public header: number) {
        super("header");
    }

    isActive(props: any): boolean {
        const node = props as SFHeaderNode;
        if (!node) {
            return false
        }
        return node.name === "header" && node.header == this.header;
    }
}

export function SFHeaderToolbar() {
    return <Stack horizontal  horizontalAlign="space-between">
        <HeaderIcon iconName={'Header1'} header={1} />
        <HeaderIcon iconName={'Header2'} header={2} />
        <HeaderIcon iconName={'Header3'} header={3} />
        <HeaderIcon iconName={'Header4'} header={4} />
    </Stack>
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

function HeaderIcon(props: {iconName: string, header: number}) {
    const editor = useSlate() as ReactEditor;
    const node = new SFHeaderNode(props.header);
    return <IconButton iconProps={{iconName: props.iconName}} title="加粗"
                       checked={isBlockActive(editor, node)}
                       onMouseDown={(event) => {
                           event.preventDefault();
                           toggleBlock(editor, node);
                       }}/>
}
