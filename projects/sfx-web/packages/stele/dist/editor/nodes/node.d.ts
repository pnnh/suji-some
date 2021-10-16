/// <reference types="react" />
import { Descendant as SlateDescendant, Element as SlateElement, Text as SlateText } from 'slate';
export interface SFEditorModel {
    children: SFDescendant[];
}
export interface SFElement extends SlateElement {
    name: string;
    children: SFDescendant[];
}
export interface SFText extends SlateText {
    name: string;
}
export declare type SFDescendant = SFElement | SFText;
export declare function parseDescendantArray(descendants: SlateDescendant[]): SFDescendant[];
export declare function parseDescendant(descendant: SlateDescendant): SFDescendant;
export declare function parseElement(descendant: SlateDescendant): SFElement;
export declare function parseText(descendant: SlateDescendant): SFText;
export interface SFPlugin {
    renderToolbox(element: SFElement): JSX.Element;
}
