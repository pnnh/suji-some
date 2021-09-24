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

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 160 },
};

const options: IDropdownOption[] = [
    { key: 'fruitsHeader', text: 'Fruits', itemType: DropdownMenuItemType.Header },
    { key: 'apple', text: 'Apple' },
    { key: 'banana', text: 'Banana' },
    { key: 'orange', text: 'Orange', disabled: true },
    { key: 'grape', text: 'Grape' },
    { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
    { key: 'vegetablesHeader', text: 'Vegetables', itemType: DropdownMenuItemType.Header },
    { key: 'broccoli', text: 'Broccoli' },
    { key: 'carrot', text: 'Carrot' },
    { key: 'lettuce', text: 'Lettuce' },
];

const stackTokens: IStackTokens = { childrenGap: 20 };
export function SFParagraphView(props: {attributes: any, children: any, node: SFParagraphNode}) {
    const editor = useSlate() as ReactEditor;
    const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
    const buttonId = useId('callout-button');
    const onMouseUp = (event: React.SyntheticEvent<HTMLParagraphElement>) => {
        console.debug("onMouseUp", event);
        const selection = editor.selection;
        if (!selection) {
            return;
        }
        console.debug("onMouseUp2", selection);
        if (selection.anchor.offset != selection.focus.offset) {
            console.debug("onMouseUp2 显示浮动工具栏");
            toggleIsCalloutVisible();
        }
    }
    return  <>
        <p
        id={buttonId}
        onFocus={()=>{
            console.debug("focused")
        }}
        data-name={ParagraphName} {...props.attributes} onMouseUp={onMouseUp}>{props.children}</p>

    {isCalloutVisible && (
        <Callout
            className={styles.callout}
            gapSpace={0}
            target={`#${buttonId}`}
            onDismiss={toggleIsCalloutVisible}
            setInitialFocus
            beakWidth={10}
            directionalHint={DirectionalHint.topCenter}
        >
            <Stack horizontal horizontalAlign="start" tokens={{childrenGap: 8}} styles={{root:{overflow: "hidden"}}}>
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
                {/*<Stack.Item>*/}
                {/*    <Dropdown*/}
                {/*        placeholder="Select an option"*/}
                {/*        options={options}*/}
                {/*        styles={dropdownStyles}*/}
                {/*    />*/}
                {/*</Stack.Item>*/}

            </Stack>
        </Callout>
    )}
    </>
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
