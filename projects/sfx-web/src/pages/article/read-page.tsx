import ReactDOM from 'react-dom'
import React, { useEffect } from 'react'
import { getJsonData } from '@/utils/helpers'
import Prism from 'prismjs'
import '@/utils/highlight'
import { articleDelete } from '@/services/article'
import { ApiUrl } from '@/utils/config'

const ArticleMenu = () => {
  const data = getJsonData<any>()
  if (!data || !data.login) {
    return <div>
      <button className={'fx-primary-button'} onClick={() => {
        window.location.href = '/account/login'
      }}>
        登录
      </button>
    </div>
  }
  const children: JSX.Element[] = []
  const createButton = <button className={'fx-primary-button new-button'} onClick={() => {
    window.location.href = '/article/new'
  }}>
    创作
  </button>
  children.push(createButton)

  if (data.creator) {
    const editButton = <button className={'fx-primary-button edit-button'} onClick={() => {
      window.location.href = '/article/edit/' + data.pk
    }}>编辑</button>
    children.push(editButton)

    const deleteButton = <button className={'fx-primary-button delete-button'}
                                 onClick={() => {
                                   console.log('delete')
                                   if (confirm('确定删除吗？')) {
                                     console.debug('确认删除')
                                     articleDelete(data.pk).then((out) => {
                                       console.debug('articleDelete', out)
                                       if (out) {
                                         window.location.href = ApiUrl.home
                                       }
                                     })
                                   }
                                 }}>删除</button>
    children.push(deleteButton)
  }
  const elements = children.map((element, index) =>
    <div key={index}>
      {element}
    </div>)

  return <div className={'article-page-menu'}>
      {elements}
    </div>
}

export function ReadPage () {
  useEffect(() => {
    // 右上角操作菜单
    const rootElement = document.getElementById('user-menu')
    if (rootElement) {
      ReactDOM.render(<ArticleMenu/>, rootElement)
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
