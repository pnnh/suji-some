import {SFElement, SFPlugin,} from "@/components/editor/nodes/node";
import {ReactEditor, useSlate} from "slate-react";
import {
    Callout, DirectionalHint, Dropdown, DropdownMenuItemType,
    FontWeights,
    IconButton,
    IContextualMenuProps, IDropdownOption, IDropdownStyles,
    IIconProps, IStackTokens, mergeStyleSets,
    Stack
} from "@fluentui/react";
import React, {SyntheticEvent} from "react";
import {
    Editor,
    Element as SlateElement,
    Node as SlateNode,
    Path as SlatePath,
    Transforms
} from "slate";
import {NewTextNode, TextName} from "@/components/editor/nodes/text";
import {css} from "@emotion/css";
import {useBoolean, useId} from "@fluentui/react-hooks";

export const ParagraphName = "paragraph";

export function SFParagraphToolbar() {
    const editor = useSlate() as ReactEditor;
    const paragraph = NewParagraphNode("");
    console.debug("SFParagraphToolbar", paragraph);
    return <IconButton iconProps={{iconName: "HalfAlpha"}} title="段落"
                       checked={isBlockActive(editor, isActive)}
                       className={iconStyles}
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
export function NewParagraphNode(text: string): SFParagraphNode {
    return {
        name: ParagraphName,
        children: [NewTextNode(text)]
    }
}

function isActive(props: any): boolean {
    const node = props as SFParagraphNode;
    return node.name === "paragraph";
}
const styles = mergeStyleSets({
    button: {
        width: 130,
    },
    callout: {
        width: 400,
        padding: '8px 8px',
        overflowY: "hidden"
    },
    title: {
        marginBottom: 12,
        fontWeight: FontWeights.semilight,
    },
    link: {
        display: 'block',
        marginTop: 20,
    },
});
const showStyles = css`
  position: absolute;
  top: -32px;
  left: 40%;
  overflow: hidden;
`
const hideStyles = css`
  display: none;
`
const paraBoxStyles = css`position: relative;`

export function SFParagraphView(props: {attributes: any, children: any, node: SFParagraphNode}) {
    const editor = useSlate() as ReactEditor;
    const [isCalloutVisible, { setTrue: setTrue, setFalse: setFalse  }] = useBoolean(false);

    return  <div onMouseEnter={setTrue}
                 onMouseLeave={setFalse} className={paraBoxStyles}>
        {/*{isCalloutVisible && (*/}

        {/*)}*/}
        <Stack horizontal horizontalAlign="start" contentEditable={false} tokens={{childrenGap: 8}}
               // styles={{root:{overflow: "hidden", float:"right"}}}
            className={isCalloutVisible ? showStyles : hideStyles}>
            <Stack.Item>
                <SFIcon iconName={"Bold"} format={"bold"} />
            </Stack.Item>
            <Stack.Item>
                <SFIcon iconName={"Italic"} format={"italic"} />
            </Stack.Item>
            <Stack.Item>
                <SFIcon iconName={"Underline"} format={"underline"} />
            </Stack.Item>
            <Stack.Item>
                <SFIcon iconName={"Strikethrough"} format={"strike"} />
            </Stack.Item>
        </Stack>
        <p data-name={ParagraphName} {...props.attributes} >{props.children}</p>
    </div>
}

// export function toggleBlock(editor: ReactEditor, node: SFElement, isActive: (node: any) => boolean) {
//     const paragraph = NewParagraphNode("");
//     if (isBlockActive(editor, isActive)) {
//         Transforms.setNodes(editor, paragraph);
//     } else {
//         Transforms.setNodes(editor, node);
//     }
// }

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
    return <IconButton iconProps={{iconName: props.iconName}} className={iconStyles}
                       checked={isMarkActive(editor, isActive)}
                       onMouseDown={(event) => {
                           event.preventDefault();
                           toggleMark(editor, props.format, true, isActive);
                       }}/>
}

const iconStyles = css`
  background-color:rgb(237 235 233 / 40%)
`
export const ParagraphPlugin: SFPlugin = {
    renderToolbox() {
        return <Stack horizontal horizontalAlign="start" tokens={{childrenGap: 8}}>
            <SFIcon iconName={"Bold"} format={"bold"} />
            <SFIcon iconName={"Italic"} format={"italic"} />
            <SFIcon iconName={"Underline"} format={"underline"} />
            <SFIcon iconName={"Strikethrough"} format={"strike"} />
        </Stack>
    }
}
