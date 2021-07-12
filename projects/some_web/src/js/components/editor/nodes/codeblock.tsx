import React, {CSSProperties} from "react";
import SFProp from "@/js/components/editor/nodes/node";
import {IconButton, Stack} from "~/@fluentui/react";
import {ReactEditor, useSlate} from "slate-react";
import {Selection, Transforms} from 'slate';
import {SFHeaderNode} from "@/js/components/editor/nodes/header";

export class SFCodeblockNode extends SFProp {
    constructor() {
        super("codeblock");
    }

    isActive(props: any): boolean {
        const node = props as SFCodeblockNode;
        if (!node) {
            return false
        }
        return node.name === "hecodeblockader";
    }
}

export function SFCodeblockView(props: {attributes: any, children: any, node: any}) {
    return <code {...props.attributes}>{props.children}</code>
}

export function SFCodeblockToolbar() {
    const editor = useSlate() as ReactEditor;
    const node = new SFCodeblockNode();
    return <> <IconButton iconProps={{iconName: "CodeEdit"}} title="代码块"
                       onMouseDown={(event) => {
                           event.preventDefault();
                           Transforms.insertNodes(
                               editor,
                               {
                                   name: "codeblock",
                                   children: [{
                                       name: "text",
                                       text: "标题一"
                                   }]
                               }
                           )
                       }}/>
    </>
}
