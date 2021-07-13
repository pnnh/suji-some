import {SFElement, SFMark} from "@/js/components/editor/nodes/node";
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

export const ParagraphName = "paragraph";

export function SFParagraphToolbar() {
    const editor = useSlate() as ReactEditor;
    const paragraph = NewParagraphNode();
    return <IconButton iconProps={{iconName: "HalfAlpha"}} title="加粗"
                       checked={isBlockActive(editor, isActive)}
                       onMouseDown={(event) => {
                           event.preventDefault();
                           toggleBlock(editor, paragraph, isActive);
                       }}/>
}
export interface SFParagraphNode extends SFElement  {
}
export function NewParagraphNode(): SFParagraphNode {
    return {
        name: ParagraphName,
        children: []
    }
}

function isActive(props: any): boolean {
    const node = props as SFParagraphNode;
    return node.name === "paragraph";
}
export function SFParagraphView(props: {attributes: any, children: any, node: SFParagraphNode}) {
    return <p {...props.attributes}>{props.children}</p>
}

export function toggleBlock(editor: ReactEditor, node: SFElement, isActive: (node: any) => boolean) {
    const paragraph = NewParagraphNode();
    if (isBlockActive(editor, isActive)) {
        Transforms.setNodes(editor, paragraph);
    } else {
        Transforms.setNodes(editor, node);
    }
}

export function isBlockActive(editor: ReactEditor, isActive: (node: any) => boolean): boolean {
    const [match] = Editor.nodes(editor, {
        match: (n: SlateNode) => {
            return !Editor.isEditor(n) && SlateElement.isElement(n) && isActive(n);
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
