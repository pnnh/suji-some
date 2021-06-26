
import {BaseText} from "slate/dist/interfaces/text";
import {
    Editor,
    Transforms,
    createEditor,
    Path as SlatePath,
    Node as SlateNode,
    Descendant as SlateDescendant,
    Element as SlateElement, BaseElement, ExtendedType, BaseEditor,
} from 'slate'

export default interface SFXNode extends SlateElement {
    type: string
}

