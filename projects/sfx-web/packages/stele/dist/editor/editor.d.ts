/// <reference types="react" />
import './highlight';
import { SFEditorModel } from './nodes/node';
import './editor.scss';
declare function SFXEditor(props: {
    value: SFEditorModel;
    onChange: (value: SFEditorModel) => void;
}): JSX.Element;
export { SFXEditor };
