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
import {Selection, Transforms} from 'slate';
import {HeaderName, NewHeaderNode, SFHeaderNode} from "@/js/components/editor/nodes/header";
import {css} from "@emotion/css";
import {isBlockActive, toggleBlock} from "@/js/components/editor/nodes/paragraph";

export const CodeblockName = "codeblock";
export const CodeName = "code";

export interface SFCodeblockNode extends SFElement {
    language: string;
    children: SFCodeText[];
}

export interface SFCodeText extends SFText {
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
    const node: SFCodeblockNode = {name: CodeblockName, children: [], language: "js"};
    node.children.push({name: CodeName, text: "<h1>hello</h1>console.log(\"hello\");",
        language: "js"});
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

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 150 },
};

const options: IDropdownOption[] = [
    { key: 'html', text: 'HTML' },
    { key: 'js', text: 'JavaScript' },
    { key: 'css', text: 'CSS' },
    { key: 'java', text: 'Java' }
];

function SelectLanguage(props: {element: SFCodeblockNode}) {
    const editor = useSlate() as ReactEditor;
    return <Dropdown
        options={options}
        styles={dropdownStyles}
        defaultSelectedKey={props.element.language}
        onChange={(event, value) => {
            console.debug("Select Language", value);
            if (value && typeof value.key == "string") {
                let children: SFCodeText[] = [];
                for(let key in props.element.children) {
                    children.push({name: CodeName, text: props.element.children[key].text,
                        language: value.key});
                }
                const codeblockNode: SFCodeblockNode = {name: CodeblockName,
                    children: children, language: value.key,
                }
                console.debug("Select Language2", codeblockNode);
                //Transforms.setNodes(editor, codeblockNode);
            }
        }}
    />
}

export const CodeblockPlugin: SFPlugin = {
    renderToolbox(element) {
        console.debug("CodeblockPlugin", element);
       return <SelectLanguage element={element as SFCodeblockNode} />
    }
}
