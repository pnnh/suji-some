import ReactDOM from 'react-dom'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AccountPage from '@/pages/account/account-page'
import RandomPasswordPage from '@/pages/utils/random-password'
import { renderExceptionPage } from '@/views/exception/render'
import { getJsonData } from '@/utils/helpers'
import NotFoundPage from '@/views/exception/not-found'
import NewPage from '@/pages/article/new-page'
import EditPage from '@/pages/article/edit-page'
import { ReadPage } from '@/pages/article/read-page'
import { HomePage } from '@/pages/home/home'
import { GoTop } from '@/components/go-top'
import MD5Page from '@/pages/utils/md5'
import PersonalPage from '@/pages/account/personal-page'
import AccountEditPage from '@/pages/account/edit-page'

const App = () => {
  const data = getJsonData<any>()
  // 正常情况下该属性为空，有值时代表页面无权访问
  if (data && data.status) {
    return renderExceptionPage(data.status)
  }
  return <Router>
    <Routes>
      <Route path="/article/new" element={<NewPage/>}/>
      <Route path="/article/edit/:pk" element={<EditPage/>}/>
      <Route path="/article/read/:pk" element={<ReadPage />}/>
      <Route path="/utils/random/password" element={<RandomPasswordPage/>}/>
      <Route path="/utils/encrypt/md5" element={<MD5Page/>}/>
      <Route path="/account/login" element={<AccountPage/>}/>
      <Route path="/account/personal" element={<PersonalPage/>}/>
      <Route path="/account/edit" element={<AccountEditPage/>}/>
      <Route path="/" element={<HomePage/>}/>
      <Route path="*" element={<NotFoundPage/>}/>
    </Routes>
  </Router>
}

// 不直接呈现React组件了，而是通过Web Component呈现
const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.render(<App/>, rootElement)
}

const goTopElement = document.getElementById('go-top')
if (goTopElement) {
  ReactDOM.render(<GoTop/>, goTopElement)
}
