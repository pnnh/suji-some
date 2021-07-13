import {SFElement, SFPlugin,} from "@/js/components/editor/nodes/node";
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
import {TextName} from "@/js/components/editor/nodes/text";
import {HeaderName, SFHeaderNode} from "@/js/components/editor/nodes/header";

export const ParagraphName = "paragraph";

export function SFParagraphToolbar() {
    const editor = useSlate() as ReactEditor;
    const paragraph = NewParagraphNode();
    paragraph.children.push({name: TextName, text: ""});
    console.debug("SFParagraphToolbar", paragraph);
    return <IconButton iconProps={{iconName: "HalfAlpha"}} title="加粗"
                       checked={isBlockActive(editor, isActive)}
                       onMouseDown={(event) => {
                           event.preventDefault();
                           Transforms.insertNodes(
                               editor,
                               paragraph
                           );
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
    return <p data-name={ParagraphName} {...props.attributes}>{props.children}</p>
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
    });
    return !!match
}

export function toggleMark<T>(editor: ReactEditor, key: string, value: any, isActive: (node: any) => boolean) {
    if (isMarkActive(editor, isActive)) {
        Editor.removeMark(editor, key);
    } else {
        Editor.addMark(editor, key, value);
    }
}

export function isMarkActive<T>(editor: ReactEditor, isActive: (node: any) => boolean): boolean {
    const marks = Editor.marks(editor);
    if (!marks) {
        return false;
    }
    return isActive(marks);
}

function SFIcon(props: {iconName: string, format: string}) {
    const editor = useSlate() as ReactEditor;
    const isActive = (marks: any): boolean => {
        if (!marks || marks.name != TextName) {
            return false;
        }
        for(let key in marks) {
            if (!marks.hasOwnProperty(key)) {
                continue;
            }
            if (key == props.format && typeof marks[key] == "boolean") {
                return Boolean(marks[key]);
            }
        }
        return false;
    }
    return <IconButton iconProps={{iconName: props.iconName}}
                       checked={isMarkActive(editor, isActive)}
                       onMouseDown={(event) => {
                           event.preventDefault();
                           toggleMark(editor, props.format, true, isActive);
                       }}/>
}

export const ParagraphPlugin: SFPlugin = {
    renderToolbox() {
        return <div>
            <SFIcon iconName={"Bold"} format={"bold"} />
            <SFIcon iconName={"Italic"} format={"italic"} />
            <SFIcon iconName={"Underline"} format={"underline"} />
            <SFIcon iconName={"Strikethrough"} format={"strike"} />
        </div>
    }
}
