import ReactDOM from "react-dom";
import React from "react";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import { registerDefaultFontFaces } from "@fluentui/theme";
import { DesignSystem } from "@microsoft/fast-foundation";
import { allComponents } from "@fluentui/web-components";
import {StatusNotFound, StatusOK, StatusUnauthorized} from "@/services/models/status";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import InternalServerErrorPage from "@/pages/exception/InternalServerError";
import NotFoundPage from "@/pages/exception/NotFound";
import UnauthorizedPage from "@/pages/exception/Unauthorized";
import NewPage from "@/pages/new/new-page";
import EditPage from "@/pages/new/edit-page";
import ExamplePage from "@/pages/example/example";
import AccountPage from "@/pages/account/account-page";
import RandomPasswordPage from "@/views/random-password";
import QuestPage from "@/pages/quest/quest";
import {getPageStatus} from "@/utils/helpers";

DesignSystem.getOrCreate().register(
    Object.values(allComponents).map(definition => definition())
);

interface viteEnv {
    BASE_URL: string,
    MODE: string, DEV: boolean, PROD: boolean, SSR: boolean
}

const importMeta = (import.meta as any).env as viteEnv;

if(importMeta.DEV) {
    initializeIcons('http://localhost:3000/fluentui/icons/');    // 从自定义路劲加载FluentUI图标字体
    registerDefaultFontFaces('http://localhost:3000/fluentui');  // 从自定义路劲加载FluentUI字体
} else {
    initializeIcons('https://res.sfx.xyz/fluentui/icons/');    // 从自定义路劲加载FluentUI图标字体
    registerDefaultFontFaces('https://res.sfx.xyz/fluentui');  // 从自定义路劲加载FluentUI字体
}

const renderExceptionPage = (status: number) => {
    switch(status) {
        case StatusUnauthorized:
            return <UnauthorizedPage />
        case StatusNotFound:
            return <NotFoundPage />
    }
    return <InternalServerErrorPage/>
}

const App = () =>{
    const status = getPageStatus();
    // 正常情况下该属性为空，有值时代表页面无权访问
    if (status != StatusOK) {
        return renderExceptionPage(status);
    }
    return <Router>
        <Switch>
            {/*<Route path="/post/read/:pk" component={PostShowPage} />*/}
            {/*<Route path="/post/new" component={PostPage} />*/}
            {/*<Route path="/post/edit/:pk" component={PostEditPage} />*/}
            <Route path="/article/new" component={NewPage} />
            <Route path="/article/edit/:pk" component={EditPage} />
            <Route path="/quest" component={QuestPage} />
            <Route path="/utils/random/password" component={RandomPasswordPage} />
            <Route path="/account/login" component={AccountPage} />
            <Route path="/example" component={ExamplePage} />
        </Switch>
    </Router>
}

export default App

// 不直接呈现React组件了，而是通过Web Component呈现
const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.render(<App />, rootElement);
}
