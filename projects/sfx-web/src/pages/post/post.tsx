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

export function PostPage () {
  const serverData = getJsonData<any>()
  console.debug('serverData postpage', serverData)
  let defaultPostList: IPost[] = []
  if (serverData && serverData.list) {
    defaultPostList = convertTime(serverData.list)
  }
  const [post, setPost] = useState<string>()
  const [postList, setPostList] = useState<IPost[]>(defaultPostList)

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
              selectPost(1).then(selectResult => {
                console.log('selectResult', selectResult)
                if (!selectResult || selectResult.length < 1) return
                setPostList(selectResult)
              })
            })
          }}>发送
          </button>
        </div>
      </div>
      <div className={'post-list fx-card'}>
        {renderPostList(postList)}
        <div className="page-list">
          <a className="page active" href="/?p=1">1</a><a className="page " href="/?p=2">2</a><a className="page "
                                                                                                 href="/?p=3">3</a><a
          className="page " href="/?p=4">4</a><a className="page" href="/?p=2">»</a>
        </div>
      </div>
    </div>
  </div>
}
