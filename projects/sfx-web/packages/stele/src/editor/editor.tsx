import React, { ClipboardEvent, useCallback, useMemo } from 'react'
import { Editable, withReact, Slate, ReactEditor } from 'slate-react'
import {
  Transforms,
  createEditor,
  Node as SlateNode,
  Range as SlateRange, Text, NodeEntry
} from 'slate'
import { HistoryEditor, withHistory } from 'slate-history'
import { Stack } from '@fluentui/react'
import {
  header2Markdown,
  HeaderName,
  SFHeaderNode,
  SFHeaderToolbar,
  SFHeaderView
} from './nodes/header'
import { NewTextNode, SFTextView } from './nodes/text'
import {
  NewParagraphNode, paragraph2Markdown, ParagraphName, ParagraphOnKeyDown,
  SFParagraphNode,
  SFParagraphToolbar,
  SFParagraphView
} from './nodes/paragraph'
import {
  codeBlock2Markdown,
  CodeBlockName, NewCodeNode,
  SFCodeBlockLeafView,
  SFCodeBlockNode,
  SFCodeBlockToolbar,
  SFCodeBlockView
} from './nodes/codeblock'
import Prism from 'prismjs'
import './highlight'

import {
  parseDescendant,
  parseDescendantArray, parseElement,
  parseText,
  SFEditorModel, SFText
} from './nodes/node'
import { useBoolean } from '@fluentui/react-hooks'
import {
  MarkdownName,
  NewMarkdownNode,
  SFMarkdownLeafView,
  SFMarkdownView
} from './nodes/markdown'
import { getLocalStorage, setLocalStorage } from './helpers'
import './editor.scss'

const StorageKey = 'editor-value'
// 这里是单例的，一个页面只能有一个Editor
let editorObject: ReactEditor & HistoryEditor

function SFXEditor (props: { value: SFEditorModel, onChange: (value: SFEditorModel) => void }) {
  console.debug('SFXEditor create')
  const [sourceMode, { toggle: toggleSourceMode }] = useBoolean(false)
  const renElement = useCallback(props => <Element {...props}/>, [])
  const renLeaf = useCallback(props => <Leaf {...props}/>, [])
  const editorNode = withHistory(withReact(createEditor() as ReactEditor))
  editorObject = useMemo(() => editorNode, [])
  const decorate = useCallback(decorateElement, [])
  return (
            <Slate editor={editorObject} value={props.value.children}
                   onChange={value => {
                     const editorValue = {
                       children: parseDescendantArray(value)
                     }
                     // todo 如果是sourceMode，需要先转换为文档格式
                     if (!sourceMode) {
                       console.log('onChange写入存储', editorValue)
                       setLocalStorage(StorageKey, editorValue)
                     }
                     props.onChange(editorValue)
                     // rootNode = {children: descendants};
                   }}>

                <Stack className={'stele-editor'} tokens={{ childrenGap: 8 }}>
                    <Stack.Item className={'toolbar'}>
                        <Stack horizontal horizontalAlign={'space-between'}>
                            <Stack.Item>
                                <Stack horizontal tokens={{ childrenGap: 8 }}>
                                    <Stack.Item>
                                        <SFParagraphToolbar disabled={sourceMode}/>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <SFHeaderToolbar disabled={sourceMode} />
                                    </Stack.Item>
                                    <Stack.Item>
                                        <SFCodeBlockToolbar disabled={sourceMode}/>
                                    </Stack.Item>
                                </Stack>
                            </Stack.Item>
                            <Stack.Item>
                                <Stack horizontal tokens={{ childrenGap: 8 }}>
                                    <Stack.Item>
                                      <button title='撤销' className={'icon-button'}
                                              onMouseDown={undoOperation} disabled={sourceMode}>
                                        <i className="ri-arrow-go-back-line"></i></button>
                                    </Stack.Item>
                                    <Stack.Item>
                                      <button title='重做' className={'icon-button'}
                                              onMouseDown={redoOperation} disabled={sourceMode}>
                                        <i className="ri-arrow-go-forward-line"></i></button>
                                    </Stack.Item>
                                    <Stack.Item>
                                      <button title='移除块' className={'icon-button'}
                                              onMouseDown={removeNodes} disabled={sourceMode}>
                                        <i className="ri-close-line"></i>
                                      </button>
                                    </Stack.Item>
                                    <Stack.Item>
                                      <button title='页面源码' className={'icon-button'} disabled={sourceMode}
                                              onMouseDown={() => {
                                                console.debug('showSource', props.value)
                                                toggleSourceMode()
                                                showSource(props.value, sourceMode)
                                              }}>
                                        <i className="ri-file-code-line"></i>
                                      </button>
                                    </Stack.Item>
                                </Stack>
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                    <Stack.Item grow={1} className={'body'}>
                        <Editable
                            decorate={decorate}
                            renderElement={renElement}
                            renderLeaf={renLeaf}
                            placeholder="请输入段落"
                            className={'editable'}
                            autoFocus={true}
                            readOnly={false}
                            onKeyDown={onKeyDown}
                            onPaste={onEditorPaste}
                            spellCheck={false}
                        />
                    </Stack.Item>
                </Stack>
            </Slate>
  )
}

function showSource (editorValue: SFEditorModel, sourceMode: boolean) {
  const range: SlateRange = {
    anchor: {
      path: [0], offset: 0
    },
    focus: {
      path: [editorObject.children.length - 1], offset: 1
    }
  }
  Transforms.removeNodes(editorObject, {
    at: range
  })
  if (sourceMode) {
    const editorValue = getLocalStorage(StorageKey)
    console.debug('editorValue', editorValue)
    for (let i = 0; i < editorValue.children.length; ++i) {
      const child = editorValue.children[i]
      Transforms.insertNodes(editorObject, child)
    }
  } else {
    let markdownString = ''
    // 将editorValue转换为Markdown
    for (let i = 0; i < editorValue.children.length; ++i) {
      const child = editorValue.children[i]
      switch (child.name) {
        case HeaderName:
          markdownString += header2Markdown(child as SFHeaderNode)
          break
        case ParagraphName:
          markdownString += paragraph2Markdown(child as SFParagraphNode)
          break
        case CodeBlockName:
          markdownString += codeBlock2Markdown(child as SFCodeBlockNode)
          break
      }
    }
    console.debug('markdownString', markdownString)

    const paragraph = NewMarkdownNode(markdownString)
    Transforms.insertNodes(editorObject, paragraph)
  }
}

function undoOperation () {
  editorObject.undo()
}

function redoOperation () {
  editorObject.redo()
}

function removeNodes () {
  Transforms.removeNodes(editorObject)
}

function onKeyDown (event: React.KeyboardEvent<HTMLDivElement>) {
  // for (const hotkey in HOTKEYS) {
  //     if (isHotkey(hotkey, event as any)) {
  //         event.preventDefault()
  //         // const mark = HOTKEYS[hotkey]
  //         // toggleMark(editor, mark)
  //     }
  // }
  console.debug('selection', editorObject.selection)
  const selection = editorObject.selection
  if (!selection) {
    return
  }
  console.debug('anchor', selection.anchor)
  const selectedElement = SlateNode.descendant(editorObject, selection.anchor.path.slice(0, -1))
  console.debug('selectedElement', selectedElement)
  const selectedLeaf = SlateNode.descendant(editorObject, selection.anchor.path)
  console.debug('selectedLeaf', selectedLeaf)
  const element = parseDescendant(selectedElement)
  const leaf = parseText(selectedLeaf)

  if (event.key === 'Enter') {
    if (element.name === HeaderName) {
      event.preventDefault()
      if (leaf.text.length === selection.anchor.offset) {
        // Transforms.insertNodes(editor, {
        //     type: 'paragraph',
        //     children: [{text: '', marks: []}],
        // });
        console.debug('selectedLeaf2')
        Transforms.insertNodes(editorObject, NewParagraphNode(''))
      }
      // else {
      //     Transforms.splitNodes(editor);
      //     Transforms.setNodes(editor, {type: 'paragraph'});
      // }
    } else if (element.name === CodeBlockName) {
      event.preventDefault()
      console.debug('selectedLeaf3')
      Transforms.insertNodes(editorObject, NewCodeNode('\n'))
    }
    return
  }
  if (element.name === ParagraphName) {
    ParagraphOnKeyDown(editorObject, event)
  }
}

function onEditorPaste (event: ClipboardEvent<HTMLDivElement>) {
  console.debug('onEditorPaste', event.clipboardData.getData('text'))
  const clipText = event.clipboardData.getData('text')

  console.debug('onEditorPaste2', clipText)
  console.debug('selection', editorObject.selection)
  const selection = editorObject.selection
  if (!selection || !clipText || clipText.length < 1) {
    return
  }
  console.debug('anchor', selection.anchor)
  const selectedElement = SlateNode.descendant(editorObject, selection.anchor.path.slice(0, -1))
  console.debug('selectedElement', selectedElement)
  const selectedLeaf = SlateNode.descendant(editorObject, selection.anchor.path)
  console.debug('selectedLeaf', selectedLeaf)
  const element = parseElement(selectedElement)
  const leaf = parseText(selectedLeaf)
  if (element.name === HeaderName) {
    event.preventDefault()
    if (leaf.text.length > 128) {
      console.debug('标题过长')
      return // 标题过长
    }
    const text = clipText.replaceAll('\n', '')

    console.debug('onEditorPaste selectedLeaf2', text === leaf.text, text, '|', leaf.text, '|')
    const textNode: SFText = NewTextNode(text)
    console.debug('onEditorPaste selectedLeaf3', textNode)
    Transforms.insertNodes(editorObject, textNode)
    // else {
    //     Transforms.splitNodes(editor);
    //     Transforms.setNodes(editor, {type: 'paragraph'});
    // }
  } else if (element.name === CodeBlockName) {
    event.preventDefault()
    const text = clipText
    console.debug('onEditorPaste selectedLeaf3', text === leaf.text, text, '|', leaf.text, '|')
    const codeNode: SFText = NewCodeNode(text)
    console.debug('onEditorPaste selectedLeaf4', codeNode)
    Transforms.insertNodes(editorObject, codeNode)
  }
}

const getLength = (token: string | Prism.Token): number => {
  if (typeof token === 'string') {
    return token.length
  } else if (typeof token.content === 'string') {
    return token.content.length
  } else if (Array.isArray(token.content)) {
    console.debug('getLength', typeof token.content, token.content)
    return token.content.reduce((l, t) => l + getLength(t), 0)
  }
  throw new Error('未知token类型')
}

function decorateElement ([node, path]: NodeEntry): SlateRange[] {
  console.debug('decorateElement', node, Text.isText(node))

  const ranges: SlateRange[] = []
  if (!Text.isText(node)) {
    return ranges
  }
  // if (editorValue.length > 0) {
  console.debug('decorateElement parent1', editorObject)
  if (editorObject.children.length < 1) {
    return ranges
  }
  const parentNode = SlateNode.parent(editorObject, path) as SFCodeBlockNode
  console.debug('decorateElement parent', parentNode)

  if (!parentNode || parentNode.name !== CodeBlockName) {
    return ranges
  }
  // }
  const tokens = Prism.tokenize(node.text, Prism.languages[parentNode.language])
  let start = 0

  for (const token of tokens) {
    const length = getLength(token)
    const end = start + length
    console.debug('render token ==========', token)
    if (typeof token !== 'string') {
      const range = {
        [token.type]: true,
        anchor: { path, offset: start },
        focus: { path, offset: end }
      }
      if (typeof token.alias === 'string') {
        range[token.alias] = true
      } else if (Array.isArray(token.alias)) {
        for (const k in token.alias) {
          range[k] = true
        }
      }
      ranges.push(range)
    }

    start = end
  }

  return ranges
}

function Element ({ attributes, children, element }:{attributes: any, children: any, element: any}) {
  console.debug('renderElement', element, attributes, children)
  let view: JSX.Element
  if (element.name === HeaderName) {
    view = <SFHeaderView attributes={attributes} node={element as SFHeaderNode}>
      {children}
    </SFHeaderView>
  } else if (element.name === CodeBlockName) {
    view = <SFCodeBlockView attributes={attributes} node={element}>{children}</SFCodeBlockView>
  } else if (element.name === MarkdownName) {
    view = <SFMarkdownView attributes={attributes} node={element}>{children}</SFMarkdownView>
  } else {
    view = <SFParagraphView attributes={attributes} node={element as SFParagraphNode}>{children}</SFParagraphView>
  }
  return view
}

function Leaf ({ attributes, children, leaf }:{attributes: any, children: any, leaf: any}) {
  console.debug('renderLeaf', leaf, attributes, children)
  if (leaf.name === 'text') {
    return <SFTextView attributes={attributes} node={leaf}>{children}</SFTextView>
  } else if (leaf.name === 'code') {
    return <SFCodeBlockLeafView attributes={attributes} node={leaf}>{children}</SFCodeBlockLeafView>
  } else if (leaf.name === 'mark') {
    return <SFMarkdownLeafView attributes={attributes} node={leaf}>{children}</SFMarkdownLeafView>
  }
  return <span {...attributes}>{children}</span>
}

export { SFXEditor }
