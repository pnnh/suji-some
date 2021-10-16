/// <reference types="react" />
import { SFElement, SFText } from './node';
export declare const MarkdownName = "markdown";
export declare const MarkName = "mark";
export interface SFMarkdownNode extends SFElement {
}
export interface SFMark extends SFText {
}
export declare function NewMarkNode(text: string): SFMark;
export declare function NewMarkdownNode(text: string): SFMarkdownNode;
export declare function SFMarkdownView(props: {
    attributes: any;
    children: any;
    node: SFMarkdownNode;
}): JSX.Element;
export declare function SFMarkdownLeafView(props: {
    attributes: any;
    children: any;
    node: any;
}): JSX.Element;
