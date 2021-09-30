import React from 'react'
import { SFDescendant, SFElement, SFText } from '@/components/editor/nodes/node'
import {
  IconButton
} from '@fluentui/react'
import { ReactEditor, useSlate } from 'slate-react'
import { Node as SlateNode, Path as SlatePath, Transforms } from 'slate'
import { css } from '@emotion/css'
import Prism from 'prismjs'

export const CodeBlockName = 'code-block'
export const BlockName = 'block'
export const CodeName = 'code'

export interface SFCodeBlockNode extends SFElement {
    language: string;
}

export interface SFBlock extends SFElement {
  type: string
}

export interface SFCode extends SFText {
  type: string
}

export function codeBlock2Markdown (node: SFCodeBlockNode): string {
  let mdStr = '```' + node.language + '\n'
  mdStr = mdStr + (node.children[0] as SFText).text
  return mdStr + '\n```\n\n'
}

export function NewCodeNode (text: string, type: string): SFCode {
  return { name: CodeName, text: text, type: type }
}

export function NewCodeBlockNode (language: string, text: string): SFCodeBlockNode {
  const block: SFCodeBlockNode = {
    name: CodeBlockName, children: [], language: language
  }
  const tokens = Prism.tokenize(text, Prism.languages[language])
  console.debug('NewCodeBlockNode', tokens)
  block.children = parseTokens(tokens)
  return block
}

function parseTokens (token: Prism.TokenStream) :SFDescendant[] {
  const children: SFDescendant[] = []
  if (typeof token === 'string') {
    const codeNode: SFCode = NewCodeNode(token, '')
    children.push(codeNode)
  } else if (Array.isArray(token)) {
    const node: SFBlock = {
      name: BlockName, type: '', children: []
    }
    for (const t of token) {
      const child: SFBlock = {
        name: BlockName, type: '', children: []
      }
      child.children = parseTokens(t)
      node.children.push(child)
    }
    children.push(node)
  } else {
    let type = token.type
    if (typeof token.alias === 'string') {
      type += (' ' + token.alias)
    } else if (Array.isArray(token.alias)) {
      for (const k in token.alias) {
        type += (' ' + k)
      }
    }
    if (typeof token.content === 'string') {
      const codeNode: SFCode = NewCodeNode(token.content, type)
      children.push(codeNode)
    } else {
      const node: SFBlock = {
        name: BlockName, type: type, children: []
      }
      node.children = parseTokens(token.content)
      children.push(node)
    }
  }
  console.debug('parseTokens', children)
  return children
}

const codeBlockStyles = css`
  background: #f6f6f6;
  border-radius: 4px;
  padding: 8px;
  margin: 8px 0;
  line-height: 24px;
`

export function SFCodeBlockView (props: {attributes: any, children: any, node: SFCodeBlockNode}) {
  console.debug('SFCodeBlockView', props)
  return <pre data-name={CodeBlockName} className={codeBlockStyles + 'language-' + props.node.language}
              {...props.attributes}>
            <SelectLanguage element={props.node}/>
            {props.children}
        </pre>
}

export function SFBlockView (props: {attributes: any, children: any, node: SFBlock}) {
  console.debug('SFBlockView', props)
  return <span data-name={BlockName} className={'token ' + props.node.type}
               {...props.attributes}>
      {props.children}
    </span>
}

export function SFCodeBlockLeafView (props: {attributes: any, children: any, node: any}) {
  console.debug('SFCodeBlockLeafView=========', props.node)
  // let className = 'token '
  // for (const k in props.node) {
  //   if (k === 'name' || k === 'text') continue
  //   className += (k + ' ')
  // }
  // className = className.trim()
  return <span data-name={CodeName}
                 {...props.attributes}
               // className={className}
               className={'token ' + props.node.type}>
      {props.children}
    </span>
}

export function SFCodeBlockToolbar (props: {disabled: boolean}) {
  const editor = useSlate() as ReactEditor
  const node = NewCodeBlockNode('markdown', '#aaaaa\n' +
    '\n' +
    '```shell\n' +
    'ls /home\n' +
    '```\n' +
    'console.log("dddd")')
  // const paragraphNode = NewParagraphNode("");
  console.debug('SFCodeBlockToolbar', node)
  return <> <IconButton iconProps={{ iconName: 'CodeEdit' }} title="代码块"
                        disabled={props.disabled}
                       onMouseDown={(event) => {
                         event.preventDefault()
                         Transforms.insertNodes(
                           editor,
                           // [node, paragraphNode]    // 同时插入一个段落
                           [node]
                         )
                       }}/>
    </>
}

const selectStyles = css`
  float: right;position: relative;top: 4px;
`

function SelectLanguage (props: {element: SFCodeBlockNode}) {
  const editor = useSlate() as ReactEditor
  return <select name="select" defaultValue={props.element.language} className={selectStyles}
                   onChange={(event) => {
                     console.debug('Select Language', editor, event)
                     if (event.target.value) {
                       const selection = editor.selection
                       if (!selection) {
                         return
                       }
                       const codeblockNode = SlateNode.parent(editor, selection.focus.path)
                       const parentPath = SlatePath.parent(selection.focus.path)
                       console.debug('Select Language2', codeblockNode, parentPath)
                       const newCodeblockNode: SFCodeBlockNode = {
                         name: CodeBlockName,
                         children: props.element.children,
                         language: event.target.value
                       }
                       Transforms.setNodes(editor, newCodeblockNode, {
                         at: parentPath
                       })
                     }
                   }}>
        <option value="html">HTML</option>
        <option value="js" >JavaScript</option>
        <option value="css">CSS</option>
        <option value="java">Java</option>
        <option value="bash">Bash</option>
        <option value="go">Go</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="csharp">C#</option>
        <option value="markdown">Markdown</option>
        <option value="kotlin">Kotlin</option>
        <option value="json">JSON</option>
        <option value="rust">Rust</option>
        <option value="python">Python</option>
        <option value="php">PHP</option>
        <option value="sql">SQL</option>
    </select>
}
