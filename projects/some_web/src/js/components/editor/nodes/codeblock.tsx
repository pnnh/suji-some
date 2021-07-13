import React, {CSSProperties} from "react";
import {SFCode, SFElement,} from "@/js/components/editor/nodes/node";
import {IconButton, Stack} from "@fluentui/react";
import {ReactEditor, useSlate} from "slate-react";
import {Selection, Transforms} from 'slate';
import {SFHeaderNode} from "@/js/components/editor/nodes/header";
import {css} from "@emotion/css";

export const CodeblockName = "codeblock";
export const CodeName = "code";

export interface SFCodeblockNode extends SFElement {
    language: string;
}

export function SFCodeblockView(props: {attributes: any, children: any, node: any}) {
    return <div data-name={CodeblockName} {...props.attributes}>{props.children}</div>
}

export function SFCodeblockLeafView(props: {attributes: any, children: any, node: any}) {
    return (
        <span data-name={CodeName}
            {...props.attributes}
            className={css`
            font-family: monospace;
            background: hsla(0, 0%, 100%, .5);
        ${props.node.comment &&
            css`
            color: slategray;
          `} 
        ${(props.node.operator || props.node.url) &&
            css`
            color: #9a6e3a;
          `}
        ${props.node.keyword &&
            css`
            color: #07a;
          `}
        ${(props.node.variable || props.node.regex) &&
            css`
            color: #e90;
          `}
        ${(props.node.number ||
                props.node.boolean ||
                props.node.tag ||
                props.node.constant ||
                props.node.symbol ||
                props.node['attr-name'] ||
                props.node.selector) &&
            css`
            color: #905;
          `}
        ${props.node.punctuation &&
            css`
            color: #999;
          `}
        ${(props.node.string || props.node.char) &&
            css`
            color: #690;
          `}
        ${(props.node.function || props.node['class-name']) &&
            css`
            color: #dd4a68;
          `}
        `}
        >
      {props.children}
    </span>
    )
}

export function SFCodeblockToolbar() {
    const editor = useSlate() as ReactEditor;
    const node: SFCodeblockNode = {name: CodeblockName, children: [], language: "html"};
    node.children.push({name: CodeName, text: "<h1>hello</h1>"});
    console.debug("SFCodeblockToolbar", node);
    return <> <IconButton iconProps={{iconName: "CodeEdit"}} title="代码块"
                       onMouseDown={(event) => {
                           event.preventDefault();
                           Transforms.insertNodes(
                               editor,
                               node
                           )
                       }}/>
    </>
}
