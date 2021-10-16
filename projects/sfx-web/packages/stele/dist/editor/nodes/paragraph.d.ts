import { KeyboardEvent } from 'react';
import { SFElement } from './node';
import { ReactEditor } from 'slate-react';
export declare const ParagraphName = "paragraph";
export declare function SFParagraphToolbar(props: {
    disabled: boolean;
}): JSX.Element;
export interface SFParagraphNode extends SFElement {
}
export declare function NewParagraphNode(text: string): SFParagraphNode;
export declare function paragraph2Markdown(node: SFParagraphNode): string;
export declare function SFParagraphView(props: {
    attributes: any;
    children: any;
    node: SFParagraphNode;
}): JSX.Element;
export declare function ParagraphOnKeyDown(editor: ReactEditor, event: KeyboardEvent<HTMLParagraphElement>): void;
export declare function isBlockActive(editor: ReactEditor, isActive: (node: any) => boolean): boolean;
