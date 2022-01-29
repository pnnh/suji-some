import React from 'react'

export function TodoPage () {
  return <div className={'todo-page'}>
    <div className={'content'}>
      <h3>待办任务</h3>
      <div className={'task-new'}>
        <input type={'text'} className={'fx-input'} placeholder={'请输入任务'}></input>
      </div>
      <div className={'task-list'}>
        <div className={'task-item'}>任务一</div>
        <div className={'task-item'}>任务一</div>
        <div className={'task-item'}>任务一</div>
        <div className={'task-item'}>任务一</div>
        <div className={'task-item'}>任务一</div>
        <div className={'task-item'}>任务一</div>
        <div className={'task-item'}>任务一</div>
        <div className={'task-item'}>任务一</div>
      </div>
    </div>
  </div>
}
