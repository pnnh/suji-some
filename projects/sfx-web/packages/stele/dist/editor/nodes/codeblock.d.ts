/// <reference types="react" />
import { SFElement, SFText } from './node';
import { ReactEditor } from 'slate-react';
export declare const CodeBlockName = "code-block";
export declare const CodeName = "code";
export interface SFCodeBlockNode extends SFElement {
    language: string;
}
export interface SFCode extends SFText {
}
export declare function codeBlock2Markdown(node: SFCodeBlockNode): string;
export declare function NewCodeNode(text: string): SFCode;
export declare function NewCodeBlockNode(language: string, text: string): SFCodeBlockNode;
export declare function SFCodeBlockView(props: {
    attributes: any;
    children: any;
    node: SFCodeBlockNode;
}): JSX.Element;
export declare function isBlockActive(editor: ReactEditor, isActive: (node: any) => boolean): boolean;
export declare function SFCodeBlockLeafView(props: {
    attributes: any;
    children: any;
    node: any;
}): JSX.Element;
export declare function SFCodeBlockToolbar(props: {
    disabled: boolean;
}): JSX.Element;
