import ReactDOM from 'react-dom'
import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import AccountPage from '@/pages/account/account-page'
import RandomPasswordPage from '@/pages/utils/random-password'
import {renderExceptionPage} from '@/pages/exception/render'
import {getJsonData} from '@/utils/helpers'
import NotFoundPage from '@/pages/exception/not-found'
import NewPage from '@/pages/article/new-page'
import EditPage from '@/pages/article/edit-page'
import {ReadPage} from '@/pages/article/read-page'
import {HomePage} from '@/pages/home/home'
import {GoTop} from '@/components/go-top'
import PersonalPage from '@/pages/account/personal-page'
import AccountEditPage from '@/pages/account/edit-page'
import UserInfoPage from '@/pages/user/info-page'
import './index.scss'
import {TodoPage} from '@/pages/todo/todo'
import {CalendarPage} from '@/pages/calendar/calendar'
import {PostPage} from '@/pages/post/post'
import {randomPassword, randomString} from './utils/rand'

export * from '@/components/hello.svelte'
export * from '@/components/Clock.svelte'
export * from '@/components/my-element'
export * from '@/pages/utils/timestamp.svelte'
export * from '@/pages/utils/md5.svelte'

const App = () => {
  const data = getJsonData<any>()
  // 正常情况下该属性为空，有值时代表页面无权访问
  if (data && data.status) {
    return renderExceptionPage(data.status)
  }
  return <Router>
    <Routes>
      <Route path="/article/new" element={<NewPage/>}/>
      <Route path="/work/todo" element={<TodoPage/>}/>
      <Route path="/post" element={<PostPage/>}/>
      <Route path="/work/calendar" element={<CalendarPage/>}/>
      <Route path="/article/edit/:pk" element={<EditPage/>}/>
      <Route path="/article/read/:pk" element={<ReadPage/>}/>
      <Route path="/utils/random/password" element={<RandomPasswordPage/>}/>
      <Route path="/account/login" element={<AccountPage/>}/>
      <Route path="/account/personal" element={<PersonalPage/>}/>
      <Route path="/account/edit" element={<AccountEditPage/>}/>
      <Route path="/user/:pk" element={<UserInfoPage/>}/>
      <Route path="/" element={<HomePage/>}/>
      <Route path="*" element={<NotFoundPage/>}/>
    </Routes>
  </Router>
}

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.render(<App/>, rootElement)
}

const goTopElement = document.getElementById('go-top')
if (goTopElement) {
  ReactDOM.render(<GoTop/>, goTopElement)
}

window.randomString = (length = 16, number = true, letter = true,
  uppercaseLetter = true, symbol = true) => {
  const password = randomPassword(16, {
    number: number,
    letter: letter,
    uppercaseLetter: uppercaseLetter,
    symbol: symbol,
  })
  return password
}
