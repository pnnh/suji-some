import ReactDOM from 'react-dom'
import React, {useEffect, useRef, useState} from 'react'
import {
    PrimaryButton,
    Stack
} from '@fluentui/react';
import { getJsonData} from "@/utils/helpers";
import "@/utils/fluentui";
import Prism from "prismjs";

const ArticleMenu = () => {
    const data = getJsonData<any>();
    console.debug("useActionButton", data);
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
    if (e.dataset.lang) {
        const html = Prism.highlight(e.innerText, Prism.languages.javascript, e.dataset.lang);

        e.innerHTML = `<code>${html}</code>`;
    }
});

