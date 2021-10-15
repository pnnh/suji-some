import ReactDOM from 'react-dom'
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import AccountPage from '@/pages/account/account-page'
import RandomPasswordPage from '@/views/random-password'
import { renderExceptionPage } from '@/views/exception/render'
import '@/utils/fluentui'
import { getJsonData } from '@/utils/helpers'
import NotFoundPage from '@/views/exception/not-found'
import NewPage from '@/pages/article/new-page'
import EditPage from '@/pages/article/edit-page'
import { ReadPage } from '@/pages/article/read-page'
import { HomePage } from '@/pages/home/home'

const App = () => {
  const data = getJsonData<any>()
  // 正常情况下该属性为空，有值时代表页面无权访问
  if (data && data.status) {
    return renderExceptionPage(data.status)
  }
  return <Router>
    <Switch>
      <Route path="/article/new" component={NewPage}/>
      <Route path="/article/edit/:pk" component={EditPage}/>
      <Route path="/article/read/:pk" component={ReadPage}/>
      <Route path="/utils/random/password" component={RandomPasswordPage}/>
      <Route path="/account/login" component={AccountPage}/>
      <Route path="/" component={HomePage}/>
      <Route path="*" component={NotFoundPage}/>
    </Switch>
  </Router>
}

// 不直接呈现React组件了，而是通过Web Component呈现
const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.render(<App/>, rootElement)
}
