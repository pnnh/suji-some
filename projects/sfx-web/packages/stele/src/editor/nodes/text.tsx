import React, { CSSProperties } from 'react'
import { SFText } from './node'

export const TextName = 'text'

export function NewTextNode (text: string): SFText {
  return { name: TextName, text: text }
}

export function SFTextView (props: {attributes: any, children: any, node: any}) {
  const style: CSSProperties = {}

  for (const key in props.node) {
    // if (!Object.prototype.hasOwnProperty.call(props, key)) {
    //   continue
    // }
    switch (key) {
      case 'bold':
        style.fontWeight = 'bold'
        break
      case 'italic':
        style.fontStyle = 'italic'
        break
      case 'underline':
        style.textDecoration = 'underline'
        break
      case 'strike':
        style.textDecoration = 'line-through'
        break
    }
  }
  return <span data-name={TextName} {...props.attributes} style={style}>{props.children}</span>
}
