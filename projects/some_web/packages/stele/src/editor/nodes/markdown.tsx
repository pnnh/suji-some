import React from 'react'
import { SFElement, SFText } from './node'
import { css } from '@emotion/css'
import { CodeName, SFCode } from './codeblock'

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
  console.debug('SFMarkdownLeafView=========', props.node)
  let className = 'token '
  for (const k in props.node) {
    if (k === 'name' || k === 'text') continue
    className += (k + ' ')
  }
  className = className.trim()
  console.debug('SFMarkdownLeafView=========className', className)
  return <span data-name={CodeName}
               {...props.attributes}
               className={className}>
      {props.children}
    </span>
}
