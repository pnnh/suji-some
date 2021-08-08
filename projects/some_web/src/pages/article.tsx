import ReactDOM from 'react-dom'
import React, {useEffect, useRef, useState} from 'react'
import {
    PrimaryButton,
    Stack
} from '@fluentui/react';
import { getJsonData} from "@/utils/helpers";
import "@/utils/fluentui";
import Prism from "prismjs";
import "@/utils/highlight";

const ArticleMenu = () => {
    const data = getJsonData<any>();
    let userMenu = <Stack.Item align={'center'}>
        <PrimaryButton onClick={()=>{
            window.location.href = "/account/login"
        }}>
            登录
        </PrimaryButton>
    </Stack.Item>

    if (data && data.login) {
        let editBtn = <></>
        if (data.creator) {
            editBtn = <Stack.Item align={'center'}>
                <PrimaryButton onClick={()=>{
                    window.location.href = "/article/edit/" + data.pk;
                }}>
                    编辑
                </PrimaryButton>
            </Stack.Item>
        }
        userMenu = <>
            {editBtn}
            <Stack.Item align={'center'}>
                <PrimaryButton onClick={()=>{
                    window.location.href = "/article/new"
                }}>
                    创作
                </PrimaryButton>
            </Stack.Item>
        </>
    }
    return <Stack horizontal tokens={{childrenGap:8}}>
        {userMenu}
    </Stack>
}

// 右上角操作菜单
const rootElement = document.getElementById('user-menu');
if (rootElement) {
    ReactDOM.render(<ArticleMenu />, rootElement);
}

// 代码块语法高亮
const codes = document.getElementsByClassName("code")
Array.from(codes).forEach(e => {
    if (!(e instanceof HTMLElement)) {
        return;
    }
    const code = e.innerText;
    const language = e.dataset.lang;
    if (language) {
        let html = code;
        if (Prism.languages[language]) {
            html = Prism.highlight(code, Prism.languages[language], language);
        }
        e.innerHTML = `<code>${html}</code>`;
    }
});

