import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import HomePage from "@/js/views/home/home-page";
import NewPage from "@/js/views/new/new-page";
import AccountPage from "@/js/views/account/account-page";
import {getPageStatus} from "@/services/utils/helpers";
import {StatusInternalServerError, StatusNotFound, StatusOK, StatusUnauthorized} from "@/services/models/status";
import UnauthorizedPage from "@/js/views/exception/Unauthorized";
import NotFoundPage from "@/js/views/exception/NotFound";
import InternalServerErrorPage from "@/js/views/exception/InternalServerError";
import RandomPasswordPage from "@/js/views/utils/random-password";
import QuestPage from "@/js/views/quest/quest";
import ExamplePage from "@/js/views/example/example";
import EditPage from "@/js/views/new/edit-page";

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
                    <Route path="/" component={HomePage} />
                </Switch>
        </Router>
}

export default App
