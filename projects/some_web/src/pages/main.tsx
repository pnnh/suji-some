import ReactDOM from "react-dom";
import React from "react";
import {StatusNotFound, StatusOK, StatusUnauthorized} from "@/services/models/status";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import NewPage from "@/pages/new/new-page";
import EditPage from "@/pages/new/edit-page";
import ExamplePage from "@/pages/example/example";
import AccountPage from "@/pages/account/account-page";
import RandomPasswordPage from "@/views/random-password";
import QuestPage from "@/pages/quest/quest";
import {renderExceptionPage} from "@/views/exception/render";
import "@/utils/fluentui";
import {getJsonData} from "@/utils/helpers";
import NotFoundPage from "@/views/exception/not-found";

const App = () =>{
    const data = getJsonData<any>();
    // 正常情况下该属性为空，有值时代表页面无权访问
    if (data && data.status) {
        return renderExceptionPage(data.status);
    }
    return <Router>
        <Switch>
            <Route path="/article/new" component={NewPage} />
            <Route path="/article/edit/:pk" component={EditPage} />
            <Route path="/quest" component={QuestPage} />
            <Route path="/utils/random/password" component={RandomPasswordPage} />
            <Route path="/account/login" component={AccountPage} />
            <Route path="*" component={NotFoundPage} />
        </Switch>
    </Router>
}

// 不直接呈现React组件了，而是通过Web Component呈现
const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.render(<App />, rootElement);
}
