/// <reference types="react" />
import { SFElement } from './node';
import { ReactEditor } from 'slate-react';
export interface SFHeaderNode extends SFElement {
    header: number;
}
export declare const HeaderName = "header";
export declare function NewHeaderNode(header: number, text: string): SFHeaderNode;
export declare function header2Markdown(node: SFHeaderNode): string;
export declare function isBlockActive(editor: ReactEditor, isActive: (node: any) => boolean): boolean;
export declare function SFHeaderToolbar(props: {
    disabled: boolean;
}): JSX.Element;
export declare function SFHeaderView(props: {
    attributes: any;
    children: any;
    node: SFHeaderNode;
}): JSX.Element;
