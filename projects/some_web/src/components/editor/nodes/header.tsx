import {SFElement, SFPlugin} from "@/components/editor/nodes/node";
import {ReactEditor, useSlate} from "slate-react";
import {
    Callout, DirectionalHint,
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
import React, {CSSProperties, KeyboardEventHandler} from "react";
import {isBlockActive} from "@/components/editor/nodes/paragraph";
import {NewTextNode, TextName} from "@/components/editor/nodes/text";
import {css} from "@emotion/css";
import {useBoolean, useId} from "@fluentui/react-hooks";

export interface SFHeaderNode extends SFElement {
    header: number;
}
export const HeaderName = "header";

export function NewHeaderNode(header: number, text: string): SFHeaderNode {
    return {
        name: HeaderName,
        children: [NewTextNode(text)],
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
    const [isCalloutVisible, { setTrue: setTrue, setFalse: setFalse }] = useBoolean(false);
    let view: JSX.Element
    switch (props.node.header) {
        case 1:
            view = <h1 data-name={HeaderName} {...props.attributes}>{props.children}</h1>
            break;
        case 2:
            view = <h2 data-name={HeaderName} {...props.attributes}>{props.children}</h2>
            break;
        case 3:
            view = <h3 data-name={HeaderName} {...props.attributes}>{props.children}</h3>
            break;
        case 4:
            view = <h4 data-name={HeaderName} {...props.attributes}>{props.children}</h4>
            break;
        case 5:
            view = <h5 data-name={HeaderName} {...props.attributes}>{props.children}</h5>
            break;
        case 6:
            view = <h6 data-name={HeaderName} {...props.attributes}>{props.children}</h6>
            break;
        default:
            throw new Error(`未知标题: ${props.node.header}`);
    }

    return <div onMouseEnter={setTrue}
                onMouseLeave={setFalse}>
        {isCalloutVisible && (
        <Stack horizontal horizontalAlign="start" tokens={{childrenGap: 8}}
               styles={{root:{overflow: "hidden",float:"right"}}}>
            <ToolboxIcon iconName={'Header1'} header={1} />
            <ToolboxIcon iconName={'Header2'} header={2} />
            <ToolboxIcon iconName={'Header3'} header={3} />
            <ToolboxIcon iconName={'Header4'} header={4} />
        </Stack>)}
        {view}
    </div>
}

const iconStyles = css`
  background-color:rgb(237 235 233 / 40%)
`

function ToolbarIcon(props: {iconName: string, header: number}) {
    const editor = useSlate() as ReactEditor;
    const headerNode: SFHeaderNode = NewHeaderNode(1, "");
    console.debug("SFHeaderToolbar", headerNode);
    return <> <IconButton iconProps={{iconName: "Header1"}} title="标题"
                          className={iconStyles}
                          onMouseDown={(event) => {
                              event.preventDefault();
                              Transforms.insertNodes(
                                  editor,
                                  headerNode
                              );
                          }}/>
    </>
}

function ToolboxIcon(props: {iconName: string, header: number}) {
    const editor = useSlate() as ReactEditor;
    const headerNode = NewHeaderNode(props.header, "");
    const isHeaderActive = (element: any): boolean => {
        if (!element) {
            return false
        }
        return element.name === HeaderName && element.header == props.header;
    }
    return <IconButton iconProps={{iconName: props.iconName}}
                       className={iconStyles}
                       checked={isBlockActive(editor, isHeaderActive)}
                       onMouseDown={(event) => {
                           event.preventDefault();
                           // toggleBlock(editor, headerNode, isHeaderActive);
                           // 在设置样式之前其实已经不需要检测header是否激活了，直接设置即可
                           // 所以也没必要再经过toggleBlock方法
                           Transforms.setNodes(editor, headerNode);     // setNodes似乎只能改变元素属性而不能改变内容
                       }}/>
}

export const HeaderPlugin: SFPlugin = {
    renderToolbox() {
        return <div>
            <Stack horizontal  horizontalAlign="start" tokens={{childrenGap: 8}}>
                <ToolboxIcon iconName={'Header1'} header={1} />
                <ToolboxIcon iconName={'Header2'} header={2} />
                <ToolboxIcon iconName={'Header3'} header={3} />
                <ToolboxIcon iconName={'Header4'} header={4} />
            </Stack>
        </div>
    }
}
