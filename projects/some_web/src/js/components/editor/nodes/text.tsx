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
    constructor(props: {editor: ReactEditor}) {
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

    toggleMark(format: string) {
        const isActive = this.isMarkActive(format)

        if (isActive) {
            Editor.removeMark(this.editor, format)
        } else {
            Editor.addMark(this.editor, format, true);
        }
    }

    isMarkActive(format: string) {
        const marks = Editor.marks(this.editor) as SFTextNode;
        //console.debug("isMarkActive", marks);
        if (!marks) {
            return false;
        }
        switch(format) {
            case 'bold':
                return marks.bold;
            case 'italic':
                return marks.italic;
            case 'underline':
                return marks.underline;
        }
        return false;
    }
}

export function SFTextView(props: {attributes: any, children: any, node: SFTextNode}) {
    let style: CSSProperties = {}
    if (props.node.bold) {
        style.fontWeight = "bold";
    }
    if (props.node.italic) {
        style.fontStyle = "italic";
    }
    if (props.node.underline) {
        style.textDecoration = "underline";
    }
    return <span {...props.attributes} style={style}>{props.children}</span>
}
