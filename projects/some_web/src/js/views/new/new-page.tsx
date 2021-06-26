
import ReactDOM from 'react-dom'
import React, {useState} from 'react'
import {ITextFieldStyles, TextField} from "@fluentui/react/lib/TextField";
import {IStackItemStyles, IStackTokens, PrimaryButton, Stack} from '@fluentui/react';
import {IStackStyles} from "@fluentui/react/lib/Stack";
import SFXHeader from "@/js/components/header/Header";
import SFXEditor from "@/js/components/editor/editor";

const emailRegex=/^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;

type NewPageState = {
    title: string;
    email: string;
    saveErrorMsg?: string;
};

const useSaveArticle = (title: string, email: string,
                        setErrMsg: React.Dispatch<React.SetStateAction<string>>) => {
    return async () =>  {
        let content = JSON.parse(localStorage.getItem('content') as string);

        const artitle = {
            tt: title,   // 标题
            em: email,   // 邮箱
            ct: content,        // 内容
        }
        console.debug('Clicked', artitle);

        fetch('/create', {
            method: "post",     // get/post
            mode: "cors",       // same-origin/no-cors/cors
            cache: "no-cache",  // 不缓存
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: JSON.stringify(artitle),         // 格式："key1=val1&key2=val2"
        }).then((resp)=>{
            return resp.json();
        }).then(function(json) {
            console.debug("ssss", json);
            if (json) {
                if (json.show) {
                    localStorage.removeItem('title');
                    localStorage.removeItem('content');
                    window.location.href = json.show;
                } else if(json.msg) {
                    throw new Error(json.msg);
                }
            } else {
                throw new Error('未知响应');
            }
        }).catch((reason)=>{
            setErrMsg(reason.message)
        })
    }
}

const checkEmail = (value: string): string => {
    if (!value) {
        return '';
    }
    const isEmailValid = emailRegex.test(value);
    return isEmailValid ? '' : '请输入合法邮箱';
}
const setLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, value);
}
const getLocalStorage = (key: string): any => {
    return localStorage.getItem(key);
}
const getEditorValue = (): any => {
    let content = getLocalStorage('content');
    if (content) {
        return JSON.parse(content)
    }
    return null
}
const setEditorValue = (value) => {
    setLocalStorage('content', JSON.stringify(value))
}

const initialValue = [
    {
        type: 'paragraph',
        children: [
            { text: '' },
        ],
    },
]
const sectionStackTokens: IStackTokens = { childrenGap: 16 };
const NewBody = () => {

    let [title, setTitle] = useState(getLocalStorage('title') || '')
    let [email, setEmail] = useState(getLocalStorage('email') || '')
    let [errMsg, setErrMsg] = useState('')

    const saveArticleHandler = useSaveArticle(title, email, setErrMsg)
    return <Stack tokens={sectionStackTokens}>
        <Stack.Item>
            <div className="title">
                <TextField name={"title"}
                           placeholder={"文章标题"} maxLength={64}
                           value={title}
                           onChange={(event, newValue) => {
                               setTitle(newValue)
                               setLocalStorage('title', newValue);
                           } } />
            </div>
        </Stack.Item>
        <Stack.Item>
            <div className="content">
                <SFXEditor value={initialValue}
                />
            </div>
        </Stack.Item>
        <Stack.Item>
            <div className="title">
                <TextField name={"email"}
                    //ref={this.myRef}
                           value={email}
                           styles={{ fieldGroup: { width: 300 } }}
                           placeholder={"作者邮箱"} maxLength={64}
                           onChange={(event, newValue) => {
                               setEmail(newValue)
                               setLocalStorage('email', newValue);
                           } }
                           onGetErrorMessage={checkEmail}
                           validateOnFocusIn
                           validateOnFocusOut/>
            </div>
        </Stack.Item>
        <Stack.Item>
            <div className="actions">
                <Stack horizontal  tokens={{
                    childrenGap: 16,
                }}>
                    <Stack.Item styles={{
                        root: {
                            alignItems: 'center',
                            // background: DefaultPalette.themePrimary,
                            // color: DefaultPalette.white,
                            display: 'flex',
                            height: 50,
                            justifyContent: 'center',
                        },
                    }}>
                        <PrimaryButton text="保存" className={'save'}
                                       onClick={saveArticleHandler} allowDisabledFocus   />
                    </Stack.Item>
                    <Stack.Item styles={{
                        root: {
                            alignItems: 'center',
                            // background: DefaultPalette.themePrimary,
                            // color: DefaultPalette.white,
                            display: 'flex',
                            height: 50,
                            justifyContent: 'center',
                        },
                    }}>
                            <span style={{
                                color: 'rgb(164, 38, 44)',
                            }}>{errMsg}</span>
                    </Stack.Item>
                </Stack>
            </div>
        </Stack.Item>
    </Stack>
}

const NewPage = (props:{}, state: NewPageState) => {

    return <Stack>
            <SFXHeader />
            <NewBody />
    </Stack>
}

export default NewPage

