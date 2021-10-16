import React from 'react'
import { SFElement, SFText } from './node'
import { ReactEditor, useSlate } from 'slate-react'
import { Editor, Element as SlateElement, Node as SlateNode, Path as SlatePath, Transforms } from 'slate'

export const CodeBlockName = 'code-block'
export const CodeName = 'code'

export interface SFCodeBlockNode extends SFElement {
    language: string;
}

export interface SFCode extends SFText {
}

export function codeBlock2Markdown (node: SFCodeBlockNode): string {
  let mdStr = '```' + node.language + '\n'
  mdStr = mdStr + (node.children[0] as SFText).text
  return mdStr + '\n```\n\n'
}

export function NewCodeNode (text: string): SFCode {
  return { name: CodeName, text: text }
}

export function NewCodeBlockNode (language: string, text: string): SFCodeBlockNode {
  const block: SFCodeBlockNode = {
    name: CodeBlockName, children: [], language: language
  }
  const codeNode: SFCode = NewCodeNode(text)
  block.children.push(codeNode)
  return block
}

export function SFCodeBlockView (props: {attributes: any, children: any, node: SFCodeBlockNode}) {
  console.debug('SFCodeBlockView', props)
  return <pre data-name={CodeBlockName} className={'code-block language-' + props.node.language}
              {...props.attributes}>
            <SelectLanguage element={props.node}/>
            {props.children}
        </pre>
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
  return node.name === CodeBlockName
}

export function SFCodeBlockLeafView (props: {attributes: any, children: any, node: any}) {
  console.debug('SFCodeBlockLeafView=========', props.node)
  let className = 'token '
  for (const k in props.node) {
    if (k === 'name' || k === 'text') continue
    className += (k + ' ')
  }
  className = className.trim()
  return <span data-name={CodeName}
                 {...props.attributes}
               className={className}>
      {props.children}
    </span>
}

export function SFCodeBlockToolbar (props: {disabled: boolean}) {
  const editor = useSlate() as ReactEditor
  const node = NewCodeBlockNode('js', '')
  console.debug('SFCodeBlockToolbar', node)
  const className = 'icon-button' + (isBlockActive(editor, isActive) ? ' active' : '')
  return <button title='段落' className={className}
                 disabled={props.disabled}
                 onMouseDown={(event) => {
                   event.preventDefault()
                   Transforms.insertNodes(
                     editor,
                     // [node, paragraphNode]    // 同时插入一个段落
                     [node]
                   )
                 }}><i className={'ri-code-s-slash-line'}></i></button>
}

function SelectLanguage (props: {element: SFCodeBlockNode}) {
  const editor = useSlate() as ReactEditor
  return <select name="select" defaultValue={props.element.language} className={'select-language'}
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
