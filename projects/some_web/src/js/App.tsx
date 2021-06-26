import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import HomePage from "@/js/views/home/home-page";
import NewPage from "@/js/views/new/new-page";
import PostPage from "@/js/views/post/post";
import PostShowPage from "@/js/views/post/show";
import AccountPage from "@/js/views/account/account-page";
import {getPageStatus} from "@/services/utils/helpers";
import {StatusInternalServerError, StatusNotFound, StatusOK, StatusUnauthorized} from "@/services/models/status";
import UnauthorizedPage from "@/js/views/exception/Unauthorized";
import NotFoundPage from "@/js/views/exception/NotFound";
import InternalServerErrorPage from "@/js/views/exception/InternalServerError";
import PostEditPage from "@/js/views/post/edit";
import RandomPasswordPage from "@/js/views/utils/random-password";

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
    console.debug('jjjj status', status);
    // 正常情况下该属性为空，有值时代表页面无权访问
    if (status != StatusOK) {
        return renderExceptionPage(status);
    }
    return <Router>
                <Switch>
                    <Route path="/post/read/:pk" component={PostShowPage} />
                    <Route path="/post/new" component={PostPage} />
                    <Route path="/post/edit/:pk" component={PostEditPage} />
                    <Route path="/utils/random/password" component={RandomPasswordPage} />
                    <Route path="/account/login" component={AccountPage} />
                    <Route path="/" component={HomePage} />
                </Switch>
        </Router>
}

export default App
