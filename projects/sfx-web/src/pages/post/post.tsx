import React, { useState } from 'react'
import { convertTime, createPost, IPost, selectPost } from '@/services/post'
import { getJsonData } from '@/utils/helpers'

function renderPostList (postList: IPost[]) {
  const postElements: JSX.Element[] = []
  for (let i = 0; i < postList.length; i++) {
    const post = postList[i]
    const element = <div className="post-item" key={post.pk}>
      <div className="post-body">
        {post.body}
      </div>
      <div className="post-info">
        <a className="post-creator" href={'/user/' + post.creator}>
          <i className="ri-user-line"></i>{post.creator_nickname}</a>
        <span className="update-time">
          <i className="ri-time-line"></i>{post.create_time.toISOString()}</span>
      </div>
    </div>
    postElements.push(element)
  }
  return postElements
}

function renderPagination (maxPage: number, currentPage: number, pageClick: (page: number) => void) {
  let startPage = currentPage - 5
  let endPage = currentPage + 5

  if (startPage < 1) {
    startPage = 1
  }
  if (endPage > maxPage) {
    endPage = maxPage
  }
  const pageElements: JSX.Element[] = []
  const prevPage = currentPage - 1
  const nextPage = currentPage + 1

  if (prevPage >= 1) {
    const element = <a className={'page'} onClick={() => pageClick(prevPage)}>«</a>
    pageElements.push(element)
  }
  for (let i = startPage; i <= endPage; i++) {
    let classActive = ''
    if (i === currentPage) {
      classActive = 'active'
    }
    const element = <a className={'page ' + classActive} onClick={() => pageClick(i)}>{i}</a>
    pageElements.push(element)
  }
  if (nextPage <= maxPage) {
    const element = <a className={'page'} onClick={() => pageClick(nextPage)}>»</a>
    pageElements.push(element)
  }
  return pageElements
}

export function PostPage () {
  const serverData = getJsonData<any>()
  console.debug('serverData postpage', serverData)
  if (!serverData) {
    return <div>页面呈现错误，服务端数据未下发</div>
  }
  const defaultPostList = convertTime(serverData.list)
  const [post, setPost] = useState<string>()
  const [postList, setPostList] = useState<IPost[]>(defaultPostList)
  const [maxPage, setMaxPage] = useState<number>(serverData.maxPage)
  const [currentPage, setCurrentPage] = useState<number>(serverData.currentPage)

  const loadPostList = (page: number) => {
    selectPost(page).then(selectResult => {
      console.log('selectResult', selectResult)
      if (!selectResult || selectResult.list.length < 1) return
      setPostList(selectResult.list)
      setMaxPage(selectResult.maxPage)
      setCurrentPage(page)
    })
  }

  return <div className={'post-page'}>
    <div className={'content'}>
      <div className={'post-new fx-card'}>
        <div className={'post-body'}>
          <textarea className={'fx-textarea'} placeholder={'请输入动态'}
                    maxLength={4096} rows={4} value={post}
                    onChange={(event) =>
                      setPost(event.target.value)}
          ></textarea>
        </div>
        <div className={'post-submit'}>
          <button className={'fx-button'} onClick={(event) => {
            console.log('提交内容', post)
            if (!post) {
              return
            }
            createPost({ body: post }).then((result) => {
              console.log('createPost', result)
              setPost('')
              loadPostList(1)
            })
          }}>发送
          </button>
        </div>
      </div>
      <div className={'post-list fx-card'}>
        {renderPostList(postList)}
        <div className="page-list">
          {renderPagination(maxPage, currentPage, loadPostList)}
        </div>
      </div>
    </div>
  </div>
}
