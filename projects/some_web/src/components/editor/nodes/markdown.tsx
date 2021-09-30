import React from 'react'
import { SFElement, SFText } from '@/components/editor/nodes/node'
import { css } from '@emotion/css'
import { SFCode } from '@/components/editor/nodes/codeblock'

export const MarkdownName = 'markdown'
export const MarkName = 'mark'

export interface SFMarkdownNode extends SFElement {
}

export interface SFMark extends SFText {

}

export function NewMarkNode (text: string): SFMark {
  return { name: MarkName, text: text }
}

export function NewMarkdownNode (text: string): SFMarkdownNode {
  const block: SFMarkdownNode = {
    name: MarkdownName, children: []
  }
  const codeNode: SFCode = NewMarkNode(text)
  block.children.push(codeNode)
  return block
}

const codeBlockStyles = css`
  background: #f6f6f6;
  border-radius: 4px;
  padding: 8px;
  margin: 0;
  line-height: 24px;
`

export function SFMarkdownView (props: {attributes: any, children: any, node: SFMarkdownNode}) {
  console.debug('SFCodeBlockView', props)
  return <pre contentEditable={false} data-name={MarkdownName} className={codeBlockStyles} {...props.attributes}>
          {props.children}
        </pre>
}

export function SFMarkdownLeafView (props: {attributes: any, children: any, node: any}) {
  console.debug('SFCodeBlockLeafView=========', props.node)
  return (
    <span data-name={MarkName}
          {...props.attributes}
          className={css`
            font-family: monospace;
            background: hsla(0, 0%, 100%, .5);
        ${props.node.comment &&
          css`
            color: slategray;
          `} 
        ${(props.node.operator || props.node.url) &&
          css`
            color: #9a6e3a;
          `}
        ${props.node.keyword &&
          css`
            color: #07a;
          `}
        ${(props.node.variable || props.node.regex) &&
          css`
            color: #e90;
          `}
        ${(props.node.number ||
            props.node.boolean ||
            props.node.tag ||
            props.node.constant ||
            props.node.symbol ||
            props.node['attr-name'] ||
            props.node.selector) &&
          css`
            color: #905;
          `}
        ${props.node.punctuation &&
          css`
            color: #999;
          `}
        ${(props.node.string || props.node.char) &&
          css`
            color: #690;
          `}
        ${(props.node.function || props.node['class-name']) &&
          css`
            color: #dd4a68;
          `}
        `}
    >
      {props.children}
    </span>
  )
}
