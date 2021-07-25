import React, {useEffect, useState} from "react";
import SFXLayout from "@/views/layout/Layout";
import SFXHeader from "@/views/layout/Header";
import NavMenu from "@/views/layout/partial/NavMenu";
import {Icon, Link, MessageBar, MessageBarType, PrimaryButton, Stack, TextField} from "@fluentui/react";
import {accountPost} from "@/services/account";
import {sessionPost} from "@/services/session";

const useHeader = () => {
    return <SFXHeader start={<NavMenu/>}/>
}

function sendCodeToMail(mail: string, callback: (msg: any)=>void) {
    const postData = {
        email: mail,
    }
    accountPost(postData).then((out)=>{
    }).catch((error) => {
        if(error.data && error.data.msg) {
            callback(error.data.msg);
        }
    });
}

function loginByCode(mail: string, code: string, callback: (msg: any)=>void) {
    const postData = {
        email: mail,
        code: code,
    }
    sessionPost(postData).then((out)=>{
        window.location.href = '/';
    }).catch((error) => {
        if(error.data && error.data.msg) {
            callback(error.data.msg);
        }
    });
}

export default function AccountPage() {
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
                                            sendCodeToMail(email, (msg)=>{
                                                setError(msg);
                                            });
                                        }}>发送到邮箱</Link>
                                    </Stack.Item>
                                </Stack>
                            </Stack.Item>
                            <Stack.Item>
                                <PrimaryButton onClick={()=>{
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
