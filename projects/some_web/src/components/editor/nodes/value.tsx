import React from 'react'
import { Descendant as SlateDescendant } from 'slate/dist/interfaces/node'

export interface EditorValue {
    setValue(children: SlateDescendant[]): void;
    getValue(): void;
}

class editorValue implements EditorValue {
    rootNode: {children: SlateDescendant[]} = { children: [] }
    setValue (children: SlateDescendant[]) {
      this.rootNode.children = children
    }

    getValue (): SlateDescendant[] {
      return this.rootNode.children
    }
}

export function NewEditorValue (): EditorValue {
  return new editorValue()
}
