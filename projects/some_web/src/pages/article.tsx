import ReactDOM from 'react-dom'
import React, {useEffect, useRef, useState} from 'react'
import {
    PrimaryButton,
    Stack
} from '@fluentui/react';
import { getJsonData} from "@/utils/helpers";
import {ApiUrl} from "@/utils/config";
import "@/utils/fluentui";
import Prism from "prismjs";

const useActionButton = () => {
    const auth = getJsonData<any>();
    if (auth && auth.login) {
        return <PrimaryButton onClick={()=>{
            window.location.href = ApiUrl.article.new;
        }}>
            创作
        </PrimaryButton>
    } else {
        return <PrimaryButton onClick={()=>{
            window.location.href = "/account/login"
        }}>
            登录
        </PrimaryButton>
    }
}

function ArticleMenu() {
    return <Stack.Item align={'center'}>
        {useActionButton()}
    </Stack.Item>
}


const rootElement = document.getElementById('actions');
if (rootElement) {
    ReactDOM.render(<ArticleMenu />, rootElement);
}

const codes = document.getElementsByClassName("code")
Array.from(codes).forEach(e => {
    console.debug("jjjj", e);
    if (!(e instanceof HTMLElement)) {
        return;
    }
    console.debug("jjjj222", e.dataset.lang);
    if (e.dataset.lang) {
        const html = Prism.highlight(e.innerText, Prism.languages.javascript, e.dataset.lang);

        console.debug("jjjj333", html);
        e.innerHTML = html;
    }
});

