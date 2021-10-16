import { Descendant as SlateDescendant } from 'slate/dist/interfaces/node';
export interface EditorValue {
    setValue(children: SlateDescendant[]): void;
    getValue(): void;
}
export declare function NewEditorValue(): EditorValue;
