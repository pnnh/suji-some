import {SFElement, SFPlugin} from "@/js/components/editor/nodes/node";
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
import {CodeBlockName, CodeName, SFCodeblockNode} from "@/js/components/editor/nodes/codeblock";
import {TextName} from "@/js/components/editor/nodes/text";

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

export function isHeaderElement(element: any): boolean {
    if (element && element.name == HeaderName) {
        return true;
    }
    return false;
}

export function SFHeaderToolbar() {
    return <Stack horizontal  horizontalAlign="space-between">
        <ToolbarIcon iconName={'Header1'} header={1} />
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

function ToolbarIcon(props: {iconName: string, header: number}) {
    const editor = useSlate() as ReactEditor;
    const node: SFHeaderNode = {name: HeaderName, children: [], header: 1};
    node.children.push({name: TextName, text: ""});
    console.debug("SFHeaderToolbar", node);
    return <> <IconButton iconProps={{iconName: "Header1"}} title="标题"
                          onMouseDown={(event) => {
                              event.preventDefault();
                              Transforms.insertNodes(
                                  editor,
                                  node
                              );
                          }}/>
    </>
}

function ToolboxIcon(props: {iconName: string, header: number}) {
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

export const HeaderPlugin: SFPlugin = {
    renderToolbox() {
        return <div>
            <Stack horizontal  horizontalAlign="start">
                <ToolboxIcon iconName={'Header1'} header={1} />
                <ToolboxIcon iconName={'Header2'} header={2} />
                <ToolboxIcon iconName={'Header3'} header={3} />
                <ToolboxIcon iconName={'Header4'} header={4} />
            </Stack>
        </div>
    }
}
