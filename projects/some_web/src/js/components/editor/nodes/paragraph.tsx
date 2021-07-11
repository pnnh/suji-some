import SFProp, {SFMark} from "@/js/components/editor/nodes/node";
import {ReactEditor, useSlate} from "slate-react";
import {IconButton} from "@fluentui/react";
import React from "react";
import {
    Editor,
    Element as SlateElement,
    Node as SlateNode,
    Path as SlatePath,
    Transforms
} from "slate";

export function SFParagraphToolbar() {
    const editor = useSlate() as ReactEditor;
    const node = new SFParagraphNode();

    return <IconButton iconProps={{iconName: "HalfAlpha"}} title="加粗"
                       checked={isBlockActive(editor, node)}
                       onMouseDown={(event) => {
                           event.preventDefault();
                           toggleBlock(editor, node);
                       }}/>
}
export class SFParagraphNode extends SFProp  {
    constructor() {
        super("paragraph");
    }

    isActive(props: any): boolean {
        const node = props as SFParagraphNode;
        return node.name === "paragraph";
    }
}
export function SFParagraphView(props: {attributes: any, children: any, node: SFParagraphNode}) {
    return <p {...props.attributes}>{props.children}</p>
}

export function toggleBlock(editor: ReactEditor, node: SFProp) {
    if (isBlockActive(editor, node)) {
        Transforms.setNodes(editor, new SFParagraphNode());
    } else {
        Transforms.setNodes(editor, node);
    }
}

export function isBlockActive(editor: ReactEditor, node: SFProp): boolean {
    const [match] = Editor.nodes(editor, {
        match: (n: SlateNode) => {
            return !Editor.isEditor(n) && SlateElement.isElement(n) && node.isActive(n);
        },
    })
    return !!match
}

export function toggleMark<T>(editor: ReactEditor, mark: SFMark<T>) {
    const isActive = isMarkActive(editor, mark);
    if (isActive) {
        Editor.removeMark(editor, mark.key);
    } else {
        Editor.addMark(editor, mark.key, mark.value);
    }
}

export function isMarkActive<T>(editor: ReactEditor, mark: SFMark<T>): boolean {
    const marks = Editor.marks(editor);
    if (!marks) {
        return false;
    }
    return mark.isActive(marks);
}
