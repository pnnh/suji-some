import ReactDOM from 'react-dom'
import React, {useEffect, useRef, useState} from 'react'
import {
    PrimaryButton,
    Stack
} from '@fluentui/react';
import { getJsonData} from "@/utils/helpers";
import {ApiUrl} from "@/utils/config";

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

export default function UserMenu() {
    return <Stack.Item align={'center'}>
            {useActionButton()}
        </Stack.Item>
}
