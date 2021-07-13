import {SFElement} from "@/js/components/editor/nodes/node";
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

export interface SFHeaderNode extends SFElement {
    header: number;

}
export const HeaderName = "header";

export function NewHeaderNode(header: number): SFHeaderNode {
    return {
        name: HeaderName,
        children: [],
        header: header
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
            return <h1 data-name={HeaderName} {...props.attributes} >{props.children}</h1>
        case 2:
            return <h2 data-name={HeaderName} {...props.attributes}>{props.children}</h2>
        case 3:
            return <h3 data-name={HeaderName} {...props.attributes}>{props.children}</h3>
        case 4:
            return <h4 data-name={HeaderName} {...props.attributes}>{props.children}</h4>
        case 5:
            return <h5 data-name={HeaderName} {...props.attributes}>{props.children}</h5>
        case 6:
            return <h6 data-name={HeaderName} {...props.attributes}>{props.children}</h6>
    }
    throw new Error(`未知标题: ${props.node.header}`);
}

function HeaderIcon(props: {iconName: string, header: number}) {
    const editor = useSlate() as ReactEditor;
    const headerNode = NewHeaderNode(props.header);
    const isHeaderActive = (element: any): boolean => {
        if (!element) {
            return false
        }
        return element.name === HeaderName && element.header == props.header;
    }
    return <IconButton iconProps={{iconName: props.iconName}} title="加粗"
                       checked={isBlockActive(editor, isHeaderActive)}
                       onMouseDown={(event) => {
                           event.preventDefault();
                           toggleBlock(editor, headerNode, isHeaderActive);
                       }}/>
}
