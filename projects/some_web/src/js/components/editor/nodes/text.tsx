import SFNode, {SFNodeView} from "@/js/components/editor/nodes/node";
import {ReactEditor} from "slate-react";
import {IconButton} from "@fluentui/react";
import {
    Editor,
    Element as SlateElement,
    Node as SlateNode,
    Path as SlatePath,
    Transforms
} from "slate";
import React, {CSSProperties} from "react";
import {SFParagraphNode} from "@/js/components/editor/nodes/paragraph";

export class SFTextNode extends SFNode {
    bold: boolean = false;
    italic: boolean = false;
    underline: boolean = false;

    constructor() {
        super("text");
    }
}

export class SFTextToolbar extends SFNodeView<{editor: ReactEditor}> {
    node: SFTextNode;
    constructor(props) {
        super(props);
        this.node = new SFTextNode();
    }
    render() {
        return <>
            <IconButton iconProps={{iconName: 'Bold'}} title="加粗"
                        checked={this.isMarkActive('bold')}
                        onClick={()=>this.toggleMark("bold")}/>
            <IconButton iconProps={{iconName: 'Italic'}} title="斜体"
                        checked={this.isMarkActive('italic')}
                        onClick={()=> this.toggleMark("italic") }/>
            <IconButton iconProps={{iconName: 'Underline'}} title="下划线"
                        checked={this.isMarkActive('underline')}
                        onClick={()=> this.toggleMark("underline") }/>
        </>
    }

    toggleMark(format) {
        const isActive = this.isMarkActive(format)

        if (isActive) {
            Editor.removeMark(this.editor, format)
        } else {
            Editor.addMark(this.editor, format, true)
        }
    }

    isMarkActive(format) {
        const marks = Editor.marks(this.editor)
        return marks ? marks[format] === true : false
    }

}

export function SFTextView(props: {attributes, children, node: SFTextNode}) {
    let style: CSSProperties = {}
    if (props.node.bold) {
        style.fontWeight = "bold";
        //return <strong {...props.attributes}>{props.children}</strong>
    }
    if (props.node.italic) {
        style.fontStyle = "italic";
        //return <em {...props.attributes}>{props.children}</em>
    }
    if (props.node.underline) {
        style.textDecoration = "underline";
        //return <u {...props.attributes}>{props.children}</u>
    }
    //return <span {...props.attributes}>{props.children}</span>
    return <span {...props.attributes} style={style}>{props.children}</span>
}
