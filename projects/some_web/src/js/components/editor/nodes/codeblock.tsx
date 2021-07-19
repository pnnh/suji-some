import React, {CSSProperties} from "react";
import {SFDescendant, SFElement, SFPlugin, SFText,} from "@/js/components/editor/nodes/node";
import {
    Dropdown,
    DropdownMenuItemType,
    IconButton,
    IDropdownOption,
    IDropdownStyles,
    IStackTokens,
    Stack
} from "@fluentui/react";
import {ReactEditor, useSlate} from "slate-react";
import {Node as SlateNode, Path as SlatePath, Selection, Transforms} from 'slate';
import {css} from "@emotion/css";
import {NewParagraphNode} from "@/js/components/editor/nodes/paragraph";

export const CodeBlockName = "code-block";
export const CodeName = "code";

export interface SFCodeBlockNode extends SFElement {
    language: string;
}

export interface SFCode extends SFText {

}

export function NewCodeNode(text: string): SFCode {
    return {name: CodeName, text: text, }
}

export function NewCodeBlockNode(language: string, text: string): SFCodeBlockNode {
    const block: SFCodeBlockNode = {
        name: CodeBlockName, children: [], language: language
    }
    const codeNode: SFCode = NewCodeNode(text);
    block.children.push(codeNode);
    return block;
}

const codeBlockStyles = css`
  background: #f6f6f6;
  border-radius: 4px;
  padding: 8px;
  margin: 8px 0;
  line-height: 24px;
`

export function SFCodeBlockView(props: {attributes: any, children: any, node: any}) {
    return <pre data-name={CodeBlockName} className={codeBlockStyles} {...props.attributes}>{props.children}</pre>
}

export function SFCodeBlockLeafView(props: {attributes: any, children: any, node: any}) {
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

export function SFCodeBlockToolbar() {
    const editor = useSlate() as ReactEditor;
    const node = NewCodeBlockNode("js", "console.log(\"hello\");");
    const paragraphNode = NewParagraphNode("");
    console.debug("SFCodeBlockToolbar", node);
    return <> <IconButton iconProps={{iconName: "CodeEdit"}} title="代码块"
                       onMouseDown={(event) => {
                           event.preventDefault();
                           Transforms.insertNodes(
                               editor,
                               [node, paragraphNode]    // 同时插入一个段落
                           )
                       }}/>
    </>
}

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 150 },
};

const options: IDropdownOption[] = [
    { key: 'html', text: 'HTML' },
    { key: 'js', text: 'JavaScript' },
    { key: 'css', text: 'CSS' },
    { key: 'java', text: 'Java' }
];

function SelectLanguage(props: {element: SFCodeBlockNode}) {
    const editor = useSlate() as ReactEditor;
    return <Dropdown
        options={options}
        styles={dropdownStyles}
        defaultSelectedKey={props.element.language}
        onChange={(event, value) => {
            console.debug("Select Language", editor);
            if (value && typeof value.key == "string") {
                const selection = editor.selection;
                if (!selection) {
                    return;
                }
                const codeblockNode = SlateNode.parent(editor, selection.focus.path);
                const parentPath = SlatePath.parent(selection.focus.path);
                console.debug("Select Language2", codeblockNode, parentPath);
                const newCodeblockNode: SFCodeBlockNode = {name: CodeBlockName,
                    children: props.element.children, language: value.key,
                }
                Transforms.setNodes(editor, newCodeblockNode, {
                    at: parentPath
                });
            }
        }}
    />
}

export const CodeblockPlugin: SFPlugin = {
    renderToolbox(element) {
        console.debug("CodeblockPlugin", element);
       return <SelectLanguage element={element as SFCodeBlockNode} />
    }
}
