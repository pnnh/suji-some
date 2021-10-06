import React, { KeyboardEvent } from 'react'
import { SFElement, SFText } from '@/components/editor/nodes/node'
import { ReactEditor, useSlate } from 'slate-react'
import { IconButton, Stack } from '@fluentui/react'
import {
  Editor,
  Element as SlateElement,
  Node as SlateNode,
  Range as SlateRange,
  Transforms
} from 'slate'
import { NewTextNode, TextName } from '@/components/editor/nodes/text'
import { css } from '@emotion/css'
import { useBoolean } from '@fluentui/react-hooks'
import isHotkey from 'is-hotkey'
import { v4 as uuid4 } from 'uuid'

export const ParagraphName = 'paragraph'

export function SFParagraphToolbar (props: {disabled: boolean}) {
  const editor = useSlate() as ReactEditor
  const paragraph = NewParagraphNode('')
  console.debug('SFParagraphToolbar', paragraph)
  return <IconButton iconProps={{ iconName: 'HalfAlpha' }} title="段落"
                       checked={isBlockActive(editor, isActive)}
                       className={iconStyles}
                     disabled={props.disabled}
                       onMouseDown={(event) => {
                         event.preventDefault()
                         Transforms.insertNodes(
                           editor,
                           paragraph
                         )
                       }}/>
}
export interface SFParagraphNode extends SFElement {
  id: string
}
export function NewParagraphNode (text: string): SFParagraphNode {
  return {
    id: uuid4().substr(0, 8),
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

const showStyles = css`
  position: absolute;
  top: -32px;
  left: 40%;
  overflow: hidden;background-color:#fff;
`
const hideStyles = css`
  display: none;
`
const paraBoxStyles = css`position: relative;`

export function SFParagraphView (props: {attributes: any, children: any, node: SFParagraphNode}) {
  const editor = useSlate() as ReactEditor
  const [isCalloutVisible, { setTrue, setFalse }] = useBoolean(false)
  return <div onMouseEnter={setTrue}
                 onMouseLeave={setFalse} className={paraBoxStyles}>
        <Stack horizontal horizontalAlign="start" contentEditable={false} tokens={{ childrenGap: 8 }}
               // styles={{root:{overflow: "hidden", float:"right"}}}
            className={isCalloutVisible ? showStyles : hideStyles}>
            <Stack.Item>
                <SFIcon iconName={'Bold'} format={'bold'} node={props.node}/>
            </Stack.Item>
            <Stack.Item>
                <SFIcon iconName={'Italic'} format={'italic'} node={props.node}/>
            </Stack.Item>
            <Stack.Item>
                <SFIcon iconName={'Underline'} format={'underline'} node={props.node}/>
            </Stack.Item>
            <Stack.Item>
                <SFIcon iconName={'Strikethrough'} format={'strike'} node={props.node}/>
            </Stack.Item>
            <Stack.Item>
                <IconButton iconProps={{ iconName: 'ClearFormatting' }} title="清除格式"
                    onClick={useClearFormats(editor, props.node)}/>
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
    text += (node.children[i] as {text: string}).text
  }
  return () => {
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

// export function toggleMark (editor: ReactEditor, key: string, value: any, isActive: (node: any) => boolean) {
//   if (isMarkActive(editor, isActive)) {
//     Editor.removeMark(editor, key)
//   } else {
//     Editor.addMark(editor, key, value)
//   }
// }

export function isMarkActive (editor: ReactEditor, isActive: (node: any) => boolean): boolean {
  const marks = Editor.marks(editor)
  if (!marks) {
    return false
  }
  return isActive(marks)
}

function SFIcon (props: {iconName: string, format: string, node: SFParagraphNode}) {
  const editor = useSlate() as ReactEditor
  const isMarkActive = (editor: ReactEditor, isActive: (node: any) => boolean): boolean => {
    const marks = Editor.marks(editor) as any
    console.debug('SFIcon marks', marks)
    if (!marks) {
      return false
    }
    if (!marks || marks.name !== TextName) {
      return false
    }
    for (const key in marks) {
      console.debug('SFIcon marks11', key, Object.prototype.hasOwnProperty.call(marks, key))
      // if (!Object.prototype.hasOwnProperty.call(marks, key)) {
      //   continue
      // }
      console.debug('SFIcon marks22', key)
      if (key === props.format && typeof marks[key] === 'boolean') {
        return Boolean(marks[key])
      }
    }
    return false
  }
  return <IconButton iconProps={{ iconName: props.iconName }}
                       checked={isMarkActive(editor, isActive)}
                       onMouseDown={(event) => {
                         event.preventDefault()

                         const selection = editor.selection
                         console.debug('toggleMark-selection', selection)
                         const [firstNode, firstPath] = SlateNode.first(props.node, [])
                         const [lastNode, lastPath] = SlateNode.last(props.node, [])
                         console.debug('toggleMark-first', firstNode, firstPath, lastNode, lastPath)
                         const nodePath = ReactEditor.findPath(editor, props.node)
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
                           if (intersection) {
                             Transforms.select(editor, intersection)
                           }
                         }
                         // toggleMark(editor, props.format, true, isActive)
                         console.debug('toggleMark-toggleMark', isMarkActive(editor, isActive))
                         if (isMarkActive(editor, isActive)) {
                           Editor.removeMark(editor, props.format)
                         } else {
                           Editor.addMark(editor, props.format, true)
                         }
                       }}/>
}

const iconStyles = css`
  background-color:rgb(237 235 233 / 40%)
`
