import React from 'react'
import { SFElement, SFText } from './node'
import { ReactEditor, useSlate } from 'slate-react'
import {
  Stack
} from '@fluentui/react'
import {
  Editor, Element as SlateElement, Node as SlateNode,
  Transforms
} from 'slate'
import { NewTextNode } from './text'
import { useBoolean } from '@fluentui/react-hooks'

export interface SFHeaderNode extends SFElement {
    header: number;
}
export const HeaderName = 'header'

export function NewHeaderNode (header: number, text: string): SFHeaderNode {
  return {
    name: HeaderName,
    children: [NewTextNode(text)],
    header: header
  }
}

export function header2Markdown (node: SFHeaderNode): string {
  let mdStr = ''
  for (let i = 0; i < node.header; i++) {
    mdStr += '#'
  }
  mdStr = mdStr + ' ' + (node.children[0] as SFText).text
  return mdStr + '\n\n'
}

export function isBlockActive (editor: ReactEditor, isActive: (node: any) => boolean): boolean {
  const [match] = Editor.nodes(editor, {
    match: (n: SlateNode) => {
      return !Editor.isEditor(n) && SlateElement.isElement(n) && isActive(n)
    }
  })
  return !!match
}

function isActive (props: any): boolean {
  const node = props as SFElement
  return node.name === HeaderName
}

export function SFHeaderToolbar (props: {disabled: boolean}) {
  const editor = useSlate() as ReactEditor
  const headerNode: SFHeaderNode = NewHeaderNode(1, '')
  console.debug('SFHeaderToolbar', headerNode)
  const className = 'icon-button size-normal' + (isBlockActive(editor, isActive) ? ' active' : '')
  return <Stack horizontal horizontalAlign="space-between">
    <button title='标题' className={className}
                   disabled={props.disabled}
                   onMouseDown={(event) => {
                     event.preventDefault()
                     Transforms.insertNodes(
                       editor,
                       headerNode
                     )
                   }}><i className="ri-heading"></i></button>
</Stack>
}

export function SFHeaderView (props: {attributes: any, children: any, node: SFHeaderNode}) {
  const [isCalloutVisible, { setTrue, setFalse }] = useBoolean(false)
  let view: JSX.Element
  switch (props.node.header) {
    case 1:
      view = <h1 data-name={HeaderName} {...props.attributes}>{props.children}</h1>
      break
    case 2:
      view = <h2 data-name={HeaderName} {...props.attributes}>{props.children}</h2>
      break
    case 3:
      view = <h3 data-name={HeaderName} {...props.attributes}>{props.children}</h3>
      break
    case 4:
      view = <h4 data-name={HeaderName} {...props.attributes}>{props.children}</h4>
      break
    case 5:
      view = <h5 data-name={HeaderName} {...props.attributes}>{props.children}</h5>
      break
    case 6:
      view = <h6 data-name={HeaderName} {...props.attributes}>{props.children}</h6>
      break
    default:
      throw new Error(`未知标题: ${props.node.header}`)
  }

  return <div onMouseEnter={setTrue}
                onMouseLeave={setFalse}>
        {isCalloutVisible && (
        <Stack horizontal horizontalAlign="start" tokens={{ childrenGap: 8 }}
               styles={{ root: { overflow: 'hidden', float: 'right' } }}>
            <ToolboxIcon iconName={'Header1'} header={1} />
            <ToolboxIcon iconName={'Header2'} header={2} />
            <ToolboxIcon iconName={'Header3'} header={3} />
            <ToolboxIcon iconName={'Header4'} header={4} />
        </Stack>)}
        {view}
    </div>
}

function ToolboxIcon (props: {iconName: string, header: number}) {
  const editor = useSlate() as ReactEditor
  const headerNode = NewHeaderNode(props.header, '')
  const isHeaderActive = (element: any): boolean => {
    if (!element) {
      return false
    }
    return element.name === HeaderName && element.header === props.header
  }

  const className = 'icon-button size-normal' + (isBlockActive(editor, isHeaderActive) ? ' active' : '')
  return <button title='标题' className={className}
          onMouseDown={(event) => {
            event.preventDefault()
            Transforms.setNodes(editor, headerNode) // setNodes似乎只能改变元素属性而不能改变内容
          }}><i className={'ri-h-' + props.header}></i></button>
}
