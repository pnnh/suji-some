import React, { KeyboardEvent } from 'react'
import { SFElement, SFText } from './node'
import { ReactEditor, useSlate } from 'slate-react'
import { Stack } from '@fluentui/react'
import {
  Editor,
  Element as SlateElement,
  Node as SlateNode,
  Range as SlateRange,
  Transforms
} from 'slate'
import { NewTextNode, TextName } from './text'
import { useBoolean } from '@fluentui/react-hooks'
import isHotkey from 'is-hotkey'

export const ParagraphName = 'paragraph'

export function SFParagraphToolbar (props: { disabled: boolean }) {
  const editor = useSlate() as ReactEditor
  const paragraph = NewParagraphNode('')
  const className = 'icon-button size-normal' + (isBlockActive(editor, isActive) ? ' active' : '')
  return <button title='段落' className={className}
                       disabled={props.disabled}
                       onMouseDown={(event: React.MouseEvent) => {
                         console.debug('SFParagraphToolbar onClick')
                         event.preventDefault()
                         Transforms.insertNodes(
                           editor,
                           paragraph
                         )
                       }}><i className="ri-paragraph"></i></button>
}

export interface SFParagraphNode extends SFElement {
}

export function NewParagraphNode (text: string): SFParagraphNode {
  return {
    name: ParagraphName,
    children: [NewTextNode(text)]
  }
}

export function paragraph2Markdown (node: SFParagraphNode): string {
  let mdStr = ''
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]
    mdStr += (child as SFText).text
  }
  return mdStr + '\n\n'
}

function isActive (props: any): boolean {
  const node = props as SFParagraphNode
  return node.name === 'paragraph'
}

export function SFParagraphView (props: { attributes: any, children: any, node: SFParagraphNode }) {
  const editor = useSlate() as ReactEditor
  const [isCalloutVisible, { setTrue, setFalse }] = useBoolean(false)
  return <div onMouseEnter={setTrue}
              onMouseLeave={setFalse} className={'paragraph'}>
    <Stack horizontal horizontalAlign="start" contentEditable={false} tokens={{ childrenGap: 8 }}
           className={isCalloutVisible ? 'show' : 'hidden'}>
      <Stack.Item>
        <SFIcon iconName={'ri-bold'} format={'bold'} node={props.node}/>
      </Stack.Item>
      <Stack.Item>
        <SFIcon iconName={'ri-italic'} format={'italic'} node={props.node}/>
      </Stack.Item>
      <Stack.Item>
        <SFIcon iconName={'ri-underline'} format={'underline'} node={props.node}/>
      </Stack.Item>
      <Stack.Item>
        <SFIcon iconName={'ri-strikethrough'} format={'strike'} node={props.node}/>
      </Stack.Item>
      <Stack.Item>
        <button title='清除格式' className={'icon-button'}
                onMouseDown={useClearFormats(editor, props.node)}>
          <i className="ri-format-clear"></i></button>
      </Stack.Item>
    </Stack>
    <p data-name={ParagraphName} {...props.attributes}>{props.children}</p>
  </div>
}

export function ParagraphOnKeyDown (editor: ReactEditor, event: KeyboardEvent<HTMLParagraphElement>) {
  console.debug('ParagraphOnKeyDown')
  if (isHotkey('mod+b', event)) {
    console.debug('加粗')
    Editor.addMark(editor, 'bold', true)
  } else if (isHotkey('mod+i', event)) {
    console.debug('斜体')
    Editor.addMark(editor, 'italic', true)
  } else if (isHotkey('mod+u', event)) {
    console.debug('下划线')
    Editor.addMark(editor, 'underline', true)
  }
}

function useClearFormats (editor: ReactEditor, node: SFParagraphNode) {
  let text = ''
  for (const i in node.children) {
    text += (node.children[i] as { text: string }).text
  }
  return () => {
    const nodePath = ReactEditor.findPath(editor, node)
    Transforms.select(editor, nodePath)
    console.debug('useClearFormats', text)
    const paragraph = NewParagraphNode(text)
    Transforms.removeNodes(editor)
    Transforms.insertNodes(editor, paragraph)
  }
}

export function isBlockActive (editor: ReactEditor, isActive: (node: any) => boolean): boolean {
  const [match] = Editor.nodes(editor, {
    match: (n: SlateNode) => {
      return !Editor.isEditor(n) && SlateElement.isElement(n) && isActive(n)
    }
  })
  return !!match
}

function calcSelection (editor: ReactEditor, node: SlateNode) {
  const selection = editor.selection
  console.debug('toggleMark-selection', selection)
  const [firstNode, firstPath] = SlateNode.first(node, [])
  const [lastNode, lastPath] = SlateNode.last(node, [])
  console.debug('toggleMark-first', firstNode, firstPath, lastNode, lastPath)
  const nodePath = ReactEditor.findPath(editor, node)
  console.debug('toggleMark-nodePath', nodePath)
  if (selection) {
    const parent1 = SlateNode.parent(editor, selection.anchor.path)
    const parent2 = SlateNode.parent(editor, selection.focus.path)
    console.debug('toggleMark-parent', parent1, parent2)
    const nodeRange: SlateRange = {
      anchor: {
        path: nodePath.concat(firstPath), offset: 0
      },
      focus: {
        path: nodePath.concat(lastPath), offset: SlateNode.string(lastNode).length
      }
    }
    const selectRange: SlateRange = {
      anchor: selection.anchor, focus: selection.focus
    }
    const intersection = SlateRange.intersection(selectRange, nodeRange)
    console.debug('toggleMark-intersection', intersection)
    return intersection
  }
}

function SFIcon (props: { iconName: string, format: string, node: SFParagraphNode }) {
  const editor = useSlate() as ReactEditor
  const isMarkActive = (editor: ReactEditor, isActive: (node: any) => boolean): boolean => {
    const marks = Editor.marks(editor) as any
    if (!marks) {
      return false
    }
    if (!marks || marks.name !== TextName) {
      return false
    }
    for (const key in marks) {
      if (key === props.format && typeof marks[key] === 'boolean') {
        return Boolean(marks[key])
      }
    }
    return false
  }
  const className = 'icon-button size-normal' + (isMarkActive(editor, isActive) ? ' active' : '')
  return <button title='段落' className={className}
                 onMouseDown={(event) => {
                   event.preventDefault()

                   const selection = calcSelection(editor, props.node)
                   if (selection) {
                     Transforms.select(editor, selection)
                     console.debug('toggleMark-toggleMark', isMarkActive(editor, isActive))
                     if (isMarkActive(editor, isActive)) {
                       Editor.removeMark(editor, props.format)
                     } else {
                       Editor.addMark(editor, props.format, true)
                     }
                   }
                 }}><i className={props.iconName}></i></button>
}
