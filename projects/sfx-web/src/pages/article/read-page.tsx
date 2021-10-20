import ReactDOM from 'react-dom'
import React, { useEffect } from 'react'
import {
  Stack
} from '@fluentui/react'
import { getJsonData } from '@/utils/helpers'
import Prism from 'prismjs'
import '@/utils/highlight'

import { ContextualMenu } from '@fluentui/react/lib/ContextualMenu'
import { useId, useBoolean } from '@fluentui/react-hooks'
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog'
import { articleDelete } from '@/services/article'
import { ApiUrl } from '@/utils/config'

const dialogStyles = { main: { maxWidth: 450 } }
const dragOptions = {
  moveMenuItemText: '移动',
  closeMenuItemText: '关闭',
  menu: ContextualMenu,
  keepInBounds: true
}
const dialogContentProps = {
  type: DialogType.normal,
  title: '确认',
  closeButtonAriaLabel: '关闭',
  subText: '确定删除文章吗？'
}

const ArticleMenu = () => {
  const data = getJsonData<any>()
  if (!data || !data.login) {
    return <Stack.Item align={'center'}>
            <button className={'fx-primary-button'} onClick={() => {
              window.location.href = '/account/login'
            }}>
                登录
            </button>
        </Stack.Item>
  }
  const children: JSX.Element[] = []
  const createButton = <button className={'fx-primary-button new-button'} onClick={() => {
    window.location.href = '/article/new'
  }}>
            创作
        </button>
  children.push(createButton)

  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true)
  const labelId: string = useId('dialogLabel')
  const subTextId: string = useId('subTextLabel')

  if (data.creator) {
    const editButton = <button className={'fx-primary-button edit-button'} onClick={() => {
      window.location.href = '/article/edit/' + data.pk
    }}>编辑</button>
    children.push(editButton)

    const deleteButton = <button className={'fx-primary-button delete-button'} onClick={toggleHideDialog}>删除</button>
    children.push(deleteButton)
  }
  const elements = children.map((element, index) =>
        <Stack.Item key={index} align={'center'}>
            {element}
        </Stack.Item>)

  const modalProps = React.useMemo(
    () => ({
      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: false,
      styles: dialogStyles,
      dragOptions: dragOptions
    }),
    [labelId, subTextId]
  )

  return <>
        <Stack horizontal tokens={{ childrenGap: 8 }}>
            {elements}
        </Stack>
        <Dialog
            hidden={hideDialog}
            onDismiss={toggleHideDialog}
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
        >
            <DialogFooter>
                <button className={'fx-primary-button'} onClick={() => {
                  console.debug('确认删除')
                  articleDelete(data.pk).then((out) => {
                    console.debug('articleDelete', out)
                    if (out) {
                      window.location.href = ApiUrl.home
                    }
                  })
                  toggleHideDialog()
                }}>删除</button>
              <button className={'fx-primary-button'} onClick={toggleHideDialog}>取消</button>
            </DialogFooter>
        </Dialog>
    </>
}

export function ReadPage () {
  useEffect(() => {
    // 右上角操作菜单
    const rootElement = document.getElementById('user-menu')
    if (rootElement) {
      ReactDOM.render(<ArticleMenu />, rootElement)
    }
    // 代码块语法高亮
    const codes = document.getElementsByClassName('code')
    if (codes) {
      Array.from(codes).forEach(e => {
        if (!(e instanceof HTMLElement)) {
          return
        }
        const code = e.innerText
        const language = e.dataset.lang
        if (language) {
          let html = code
          if (Prism.languages[language]) {
            html = Prism.highlight(code, Prism.languages[language], language)
          }
          e.innerHTML = `<code>${html}</code>`
        }
      })
    }
  }, [])
  return <div></div>
}
