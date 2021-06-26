import React, {useEffect, useState} from "react";
import SFXLayout from "@/js/views/layout/Layout";
import SFXHeader from "@/js/views/layout/Header";
import NavMenu from "@/js/views/layout/partial/NavMenu";
import Quill from "quill";
import {getXmlData} from "@/services/utils/helpers";
import {Icon, Link, MessageBar, MessageBarType, PrimaryButton, Stack, TextField} from "@fluentui/react";
import {articlePost} from "@/services/some/article";
import {accountPost} from "@/services/some/account";
import {css} from "@emotion/css";
import {StatusAccountExists} from "@/services/models/status";
import {sessionPost} from "@/services/some/session";

const useHeader = () => {
    return <SFXHeader start={<NavMenu/>}/>
}

function sendCodeToMail(mail: string, callback: (msg)=>void) {
    const postData = {
        email: mail,
    }
    accountPost(postData).then((out)=>{
        console.debug("ok", out);
    }).catch((error) => {
        console.debug("catch", error);
        if(error.data && error.data.msg) {
            callback(error.data.msg);
        }
    });
}

function loginByCode(mail: string, code: string, callback: (msg)=>void) {
    const postData = {
        email: mail,
        code: code,
    }
    sessionPost(postData).then((out)=>{
        console.debug("ok", out);
        window.location.href = '/';
    }).catch((error) => {
        console.debug("catch", error);
        if(error.data && error.data.msg) {
            callback(error.data.msg);
        }
    });
}

export default function AccountPage() {
    console.debug('UserPage');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const useErrorMessage = () => {
        if(error) {
            return <MessageBar
                messageBarType={MessageBarType.error}
                isMultiline={false}
                dismissButtonAriaLabel="Close">
                {error}
            </MessageBar>
        } else if (info) {
            return <MessageBar
                messageBarType={MessageBarType.info}
                isMultiline={false}
                dismissButtonAriaLabel="Close">
                {info}
            </MessageBar>
        }
        return <span></span>
    }
    return <SFXLayout header={useHeader()} footer={<span></span>}>
        <div className="ms-Grid" dir="ltr">
            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12 ms-xl8">
                    <Stack tokens={{childrenGap: 8}}>
                        <Stack tokens={{childrenGap: 32}}>
                            <Stack.Item>
                                <TextField placeholder={'请输入邮箱'} value={email} onChange={(event, value) => {
                                    if(!value) {
                                        return;
                                    }
                                    setEmail(value);
                                }} />
                            </Stack.Item>
                            <Stack.Item>
                                <Stack horizontal verticalAlign={'end'} tokens={{childrenGap: 16}}>
                                    <Stack.Item>
                                        <TextField placeholder={'请输入验证码'} value={code} onChange={(event, value) => {
                                            if(!value) {
                                                return;
                                            }
                                            setCode(value);
                                        }} />
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Link onClick={()=>{
                                            console.debug('22222', email);
                                            sendCodeToMail(email, (msg)=>{
                                                setError(msg);
                                            });
                                        }}>发送到邮箱</Link>
                                    </Stack.Item>
                                </Stack>
                            </Stack.Item>
                            <Stack.Item>
                                <PrimaryButton onClick={()=>{
                                    console.debug('register', email);
                                    loginByCode(email, code, (msg)=>{
                                        setError(msg);
                                    })
                                }}>登录</PrimaryButton>
                            </Stack.Item>
                            <Stack.Item>
                                {useErrorMessage()}
                            </Stack.Item>
                        </Stack>
                    </Stack>
                </div>
            </div>
        </div>
    </SFXLayout>
}
